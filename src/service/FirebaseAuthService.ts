import { UserRecord } from "firebase-functions/v1/auth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { TypeAccount } from "../enum/TypeAccountEnum";
import { MyError } from "../models/MyError";
import { AuthData } from "../models/auth/AuthData";
import { LoginAccount } from "../models/auth/LoginAccount";
import { UserRecordArgs } from "../models/firebase/UserRecordArgs";
import { getFirebaseAuth } from "../utility/Firebase";
import { logError } from "../utility/Logger";
import { IsNullOrWhiteSpace } from "../utility/UtilityFunctionts";
import { geTokenDiscord, getUserInfoDiscord } from "./DiscordService.cs";

function generateVerificationLink(email: string): string {
    try {
        return await getFirebaseAuth().generateEmailVerificationLink(email);
    }
    catch (ex) {
        throw Error("generateVerificationLink Error")
    }
}

function createAccount(user: UserRecordArgs): AuthData {
    try {
        var userRecord = await getFirebaseAuth().createUser(user)
        if (!userRecord?.email || IsNullOrWhiteSpace(userRecord?.email)) {
            throw Error("Exception caught in FirebaseAuth CreateAccount: userRecord?.email is null")
        }
        var verificationLink = generateVerificationLink(userRecord?.email);
    }
    catch (ex) {
        if (ex?.HResult == -2147024809) {
            throw new MyError(ex.message, "FirebaseAuth CreateAccount")
        }
        if (ex?.HResult == -2146233088) {
            throw new MyError("The user with the provided email already exists", "FirebaseAuth CreateAccount")
        }
        logError("Exception caught in FirebaseAuth CreateAccount: {0}", ex);
        throw Error("Exception caught in FirebaseAuth CreateAccount")
    }

    _emailService.sendVerificationLinkMail(user.email, user.displayName, verificationLink);

    return new AuthData(userRecord)
}

function resetPassword(email: string) {
    try {
        var link = await getFirebaseAuth().generatePasswordResetLink(email);
    }
    catch (ex) {
        if (ex?.HResult == -2146233088) {
            throw new MyError("The user with the provided email already exists", "FirebaseAuth ResetPassword")
        }
        logError("Exception caught in FirebaseAuth ResetPassword: {0}", ex);
        throw Error("Exception caught in FirebaseAuth ResetPassword")
    }

    if (!link || IsNullOrWhiteSpace(link)) {
        throw Error("FirebaseAuth ResetPassword Is Not Successful " + email)
    }

    _emailService.SendResetPasswordMail(email, link);
}

function signInWithEmailPassword(loginModel: LoginAccount): AuthData {
    if (!loginModel.email || IsNullOrWhiteSpace(loginModel.email)) {
        throw Error("FirebaseAuth SignInWithEmailAndPasswordAsync email is null")
    }
    if (!loginModel.password || IsNullOrWhiteSpace(loginModel.password)) {
        throw Error("FirebaseAuth SignInWithEmailAndPasswordAsync password is null")
    }
    try {
        //log in an existing user
        var userCredential = await signInWithEmailAndPassword(getAuth(), loginModel.email, loginModel.password)
    }
    catch (ex) {
        if (ex?.HResult == -2146233088) {
            throw new MyError("Non-registered user or Wrong credentials", "FirebaseAuth SignInWithEmailAndPasswordAsync: Non-registered user")
        }
        logError("Exception caught in FirebaseAuth SignInWithEmailAndPasswordAsync: {0}", ex);
        throw Error("Exception caught in FirebaseAuth SignInWithEmailAndPasswordAsync")
    }
    if (userCredential == null) {
        throw Error("FirebaseAuth SignInWithEmailAndPasswordAsync Email or Password not Correct")
    }
    var authData = await GetTokenByEmail(loginModel.email);
    if (authData == null) {
        throw Error("FirebaseAuth SignInWithEmailAndPasswordAsync Is Not Successful")
    }
    return authData
}

function GetSupportRole(userCredential: UserRecord): TypeAccount {
    // TODO: var tokens = _firebaseDatabase.GetTokens(userCredential.Email);
    // TODO: check discord roles
    return TypeAccount.Free;
}

function GetTokenByEmail(email?: string): AuthData | undefined {
    let userRecord: UserRecord
    if (!email || IsNullOrWhiteSpace(email)) {
        throw Error("FirebaseAuth GetToken Error email IsNullOrWhiteSpace")
    }
    try {
        userRecord = await getFirebaseAuth().getUserByEmail(email)
    }
    catch (ex) {
        logError("Exception caught in FirebaseAuth GetToken: {0}", ex);
        throw Error("Exception caught in FirebaseAuth GetToken");
    }
    return GetToken(userRecord);
}

function GetToken(userCredential: UserRecord): AuthData | undefined {
    var expirationTime = DateTime.Today.AddDays(10);
    var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");

    var claims = new Dictionary<string, object>()
    {
        { ClaimTypes.Email, userCredential.Email },
        { ClaimTypes.NameIdentifier, userCredential.DisplayName },
        { ClaimTypes.PrimarySid, userCredential.Uid },
        { ClaimTypes.Role, TypeAccount.Free },
    };
    if (jwtSecret == null) {
        _logger.LogError("jwtSecret is null");
        // TODO: throw new MyException("jwtSecret is null");
        return null;
    }

    try {
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Claims = claims,
                Subject = new ClaimsIdentity(),
                Issuer = _configuration.GetValue<string>("Jwt:FirebaseHost:ValidIssuer"),
                IssuedAt = DateTime.Now,
                Audience = _configuration.GetValue<string>("Jwt:FirebaseHost:ValidAudience"),
                Expires = expirationTime,
                // new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256Signature)
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtSecret)
                    ),
                    SecurityAlgorithms.HmacSha256Signature
                ),
                };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));

        return new AuthData(userCredential)
        {
            Token = token,
                TokenExpirationTime = ((DateTimeOffset)expirationTime).ToUnixTimeSeconds(),
        };
    }
    catch (MyException ex)
    {
        throw ex;
    }
    catch (ex) {
        _logger.LogError("Exception caught in FirebaseAuth GetToken: {0}", ex);
        // TODO: throw new MyException("uring the generation of Token");
        return null;
    }
}

function oAuthDiscordCallback(code: string): string {
    try {
        let clientUrlOAuthDiscord: string = _configuration.GetValue<string>("Url:Client")!;

        var discordPrivateToken = await geTokenDiscord(code);

        var userInfo = await getUserInfoDiscord(discordPrivateToken);

        // * User must be verified
        if (!userInfo.verified) {
            logError("FirebaseAuth OAuthDiscordCallback: Discord account must be verified");
            throw new MyError("Discord account must be verified", "FirebaseAuth OAuthDiscordCallback")
        }

        var firebaseAuthData = await GetTokenByEmail(userInfo.email);

        // * User is not registered
        // * Because in case A has a DRincs account, but does not have a Discord account
        // * B using A's email can create an unverified Discord account, and then login to the DRincs account
        if (firebaseAuthData == null) {
            var userRecorder = await CreateAccount(userInfo);
            firebaseAuthData = await GetTokenByEmail(userInfo.email);

            if (firebaseAuthData == null) {
                logError("FirebaseAuth OAuthDiscordCallback: authService.CreateAccount Error");
                throw new MyError("There was an error when creating the account", "FirebaseAuth OAuthDiscordCallback: authService.CreateAccount Error")
            }
        }

        return new ServiceResponse<string>(clientUrlOAuthDiscord + firebaseAuthData.Token, isSuccesful: true);
    }
    catch (MyException ex)
    {
        return new ServiceResponse<string>(messages: "FirebaseAuth OAuthDiscordCallback: " + ex.MessagesToShow, messagesToShow: ex.MessagesToShow, content: null, isSuccesful: false);
    }
    catch (Exception ex)
    {
        _logger.LogError("Exception caught in FirebaseAuth OAuthDiscordCallback: {0}", ex);
        return new ServiceResponse<string>(messages: "Exception caught in FirebaseAuth OAuthDiscordCallback", content: null, isSuccesful: false);
    }
}