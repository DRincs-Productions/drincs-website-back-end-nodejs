import { FirebaseError } from '@firebase/util';
import { UserRecord } from "firebase-functions/v1/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { generate } from "generate-password";
import { sign } from "jsonwebtoken/index";
import { TypeAccount } from "../enum/TypeAccountEnum";
import { MyError } from "../models/MyError";
import { AuthData } from "../models/auth/AuthData";
import { DiscordUserInfo } from "../models/auth/DiscordUserInfo";
import { LoginAccount } from "../models/auth/LoginAccount";
import { NewAccountRecord } from "../models/auth/NewAccountRecord";
import { UserRecordArgsCreate } from "../models/firebase/UserRecordArgs";
import { getAuthFirebase, getFirebaseAuth } from "../utility/Firebase";
import { logError } from "../utility/Logger";
import { IsNullOrWhiteSpace, getClientUrl, getDefaultUserIcon, getWebApiUrl } from "../utility/UtilityFunctionts";
import { geTokenDiscord, getUserInfoDiscord } from "./DiscordService.cs";
import { sendResetPasswordMail, sendVerificationLinkMail } from "./MailService";

export async function createAccountNewAccountRecord(user: NewAccountRecord): Promise<AuthData> {
    let args: UserRecordArgsCreate = new UserRecordArgsCreate(
        user.email,
        user.displayName,
        false,
        !user.photoUrl || IsNullOrWhiteSpace(user.photoUrl) ? getDefaultUserIcon() : user.photoUrl,
        false,
        user.password
    )
    return await createAccount(args);
}

async function createAccountDiscordUserInfo(user: DiscordUserInfo): Promise<AuthData> {
    let args: UserRecordArgsCreate = new UserRecordArgsCreate(
        user.email,
        user.username,
        user.verified,
        "https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png",
        false,
        generate({
            length: 60,
            numbers: true,
            symbols: true
        })
    )
    return await createAccount(args);
}

async function generateVerificationLink(email: string): Promise<string> {
    try {
        return await getFirebaseAuth().generateEmailVerificationLink(email);
    }
    catch (ex) {
        throw Error("generateVerificationLink Error")
    }
}

async function createAccount(user: UserRecordArgsCreate): Promise<AuthData> {
    let verificationLink: string | undefined
    let userRecord: UserRecord | undefined
    try {
        userRecord = await getFirebaseAuth().createUser(user)
    }
    catch (ex) {
        if (ex instanceof FirebaseError && ex.code === "auth/invalid-password") {
            throw new MyError(ex.message, "FirebaseAuth CreateAccount")
        }
        if (ex instanceof FirebaseError && ex.code === "auth/email-already-exists") {
            throw new MyError("The user with the provided email already exists", "FirebaseAuth CreateAccount")
        }
        logError("Exception caught in FirebaseAuth CreateAccount: {0}", ex);
        throw Error("Exception caught in FirebaseAuth CreateAccount")
    }
    if (!userRecord?.email || IsNullOrWhiteSpace(userRecord?.email)) {
        throw Error("Exception caught in FirebaseAuth CreateAccount: userRecord?.email is null")
    }
    try {
        verificationLink = await generateVerificationLink(userRecord?.email);
    }
    catch (ex) {
        logError("Exception caught in FirebaseAuth CreateAccount generateVerificationLink: {0}", ex);
        throw Error("Exception caught in FirebaseAuth CreateAccount generateVerificationLink")
    }

    await sendVerificationLinkMail(user.email, user.displayName, verificationLink);

    return new AuthData(userRecord)
}

export async function resetPassword(email: string): Promise<boolean> {
    let link: string = ""
    try {
        link = await getFirebaseAuth().generatePasswordResetLink(email);
    }
    catch (ex) {
        if (ex instanceof FirebaseError && ex.code === "auth/email-not-found") {
            throw new MyError("The user with the provided email already exists", "FirebaseAuth ResetPassword")
        }
        logError("Exception caught in FirebaseAuth ResetPassword: {0}", ex);
        throw Error("Exception caught in FirebaseAuth ResetPassword")
    }

    if (!link || IsNullOrWhiteSpace(link)) {
        throw Error("FirebaseAuthService ResetPassword Is Not Successful " + email)
    }

    await sendResetPasswordMail(email, link)
    return true
}

export async function signInWithEmailPassword(loginModel: LoginAccount, audienceHost?: string): Promise<AuthData> {
    if (!loginModel.email || IsNullOrWhiteSpace(loginModel.email)) {
        throw Error("FirebaseAuthService.signInWithEmailPassword: email is null")
    }
    if (!loginModel.password || IsNullOrWhiteSpace(loginModel.password)) {
        throw Error("FirebaseAuthService.signInWithEmailPassword: password is null")
    }
    let userCredential
    try {
        //log in an existing user
        userCredential = await signInWithEmailAndPassword(getAuthFirebase(), loginModel.email, loginModel.password)
    }
    catch (ex) {
        if (ex instanceof FirebaseError && (ex.code === "auth/user-not-found" || ex.code === "auth/wrong-password")) {
            throw new MyError("Non-registered user or Wrong credentials", "FirebaseAuthService.signInWithEmailPassword")
        }
        logError("FirebaseAuthService.signInWithEmailPassword: Exception caught: {0}", ex);
        throw Error("FirebaseAuthService.signInWithEmailPassword: Exception caught")
    }
    if (!userCredential) {
        throw Error("FirebaseAuthService.signInWithEmailPassword: Email or Password not Correct")
    }
    let authData = await GetTokenByEmail(loginModel.email, audienceHost);
    if (!authData) {
        throw Error("FirebaseAuthService.signInWithEmailPassword: Is Not Successful")
    }
    return authData
}

function GetSupportRole(userCredential: UserRecord): TypeAccount {
    // TODO: let tokens = _firebaseDatabase.GetTokens(userCredential.Email);
    // TODO: check discord roles
    return TypeAccount.Free;
}

async function GetTokenByEmail(email?: string, audienceHost?: string): Promise<AuthData | undefined> {
    let userRecord: UserRecord
    if (!email || IsNullOrWhiteSpace(email)) {
        throw Error("FirebaseAuthService GetToken Error email IsNullOrWhiteSpace")
    }
    try {
        userRecord = await getFirebaseAuth().getUserByEmail(email)
    }
    catch (ex) {
        logError("Exception caught in FirebaseAuth GetToken: {0}", ex);
        throw Error("Exception caught in FirebaseAuth GetToken");
    }
    return GetToken(userRecord, audienceHost);
}

function GetToken(userCredential: UserRecord, audienceHost?: string): AuthData | undefined {
    let expirationTime = Math.floor(Date.now() / 1000) + ((60 * 60) * 24) // 1 day
    let jwtSecret = process.env.JWT_SECRET_KEY

    if (!jwtSecret) {
        throw Error("GetToken: jwtSecret is null")
    }

    // TODO check role
    let data = {
        issuer: getWebApiUrl(),
        issuedAt: Date(),
        audience: audienceHost,
        userId: userCredential.uid,
        email: userCredential.email,
        nameIdentifier: userCredential.displayName,
        role: TypeAccount.Free,
    }

    let token = sign({
        exp: expirationTime,
        data: data
    }, jwtSecret);

    return new AuthData(userCredential, expirationTime, token)
}

export async function oAuthDiscordCallback(code: string, audienceHost?: string): Promise<string> {
    let clientUrlOAuthDiscord: string = getClientUrl()

    let discordPrivateToken = await geTokenDiscord(code);

    let userInfo = await getUserInfoDiscord(discordPrivateToken);

    // * User must be verified
    if (!userInfo.verified) {
        logError("FirebaseAuthService OAuthDiscordCallback: Discord account must be verified");
        throw new MyError("Discord account must be verified", "FirebaseAuth OAuthDiscordCallback")
    }

    let firebaseAuthData = await GetTokenByEmail(userInfo.email, audienceHost);

    // * User is not registered
    // * Because in case A has a DRincs account, but does not have a Discord account
    // * B using A's email can create an unverified Discord account, and then login to the DRincs account
    if (!firebaseAuthData) {
        createAccountDiscordUserInfo(userInfo);
        firebaseAuthData = await GetTokenByEmail(userInfo.email, audienceHost);

        if (!firebaseAuthData) {
            logError("FirebaseAuthService OAuthDiscordCallback: authService.CreateAccount Error");
            throw new MyError("There was an error when creating the account", "FirebaseAuth OAuthDiscordCallback: authService.CreateAccount Error")
        }
    }

    return clientUrlOAuthDiscord + firebaseAuthData.token
}
