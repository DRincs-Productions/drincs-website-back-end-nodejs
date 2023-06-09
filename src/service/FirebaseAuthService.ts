import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { TypeAccount } from "../enum/TypeAccountEnum";
import { MyError } from "../models/MyError";
import { AuthData } from "../models/auth/AuthData";
import { LoginAccount } from "../models/auth/LoginAccount";
import { getFirebaseAuth } from "../utility/Firebase";
import { logError } from "../utility/Logger";
import { IsNullOrWhiteSpace } from "../utility/UtilityFunctionts";

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
        var userRecord = await _firebaseAuth.CreateUserAsync(user);
        var verificationLink = await generateVerificationLink(userRecord?.Email);
    }
    catch (ex) {
        if (ex?.HResult == -2147024809) {
            return new ServiceResponse<AuthData>(messages: "FirebaseAuth CreateAccount: " + ex.Message, messagesToShow: ex.Message, content: null, isSuccesful: false);
        }
        if (ex?.HResult == -2146233088) {
            return new ServiceResponse<AuthData>(messages: "FirebaseAuth CreateAccount: The user with the provided email already exists", messagesToShow: "The user with the provided email already exists", content: null, isSuccesful: false);
        }
        logError("Exception caught in FirebaseAuth CreateAccount: {0}", ex);
        throw Error("Exception caught in FirebaseAuth CreateAccount")
    }

    _emailService.sendVerificationLinkMail(user.Email, user.DisplayName, verificationLink);

    return new AuthData(userRecord)
}

function resetPassword(email: string) {
    try {
        var link = await getFirebaseAuth().generatePasswordResetLink(email);
    }
    catch (ex) {
        if (ex?.HResult == -2146233088) {
            return new ServiceResponse<string>(messages: "FirebaseAuth ResetPassword: The user with the provided email already exists", messagesToShow: "The user with the provided email already exists", content: null, isSuccesful: false);
        }
        logError("Exception caught in FirebaseAuth ResetPassword: {0}", ex);
        throw Error("Exception caught in FirebaseAuth ResetPassword")
    }

    if (!link) {
        throw Error("FirebaseAuth ResetPassword Is Not Successful " + email)
    }

    _emailService.SendResetPasswordMail(email, link);
}

function signInWithEmailPassword(loginModel: LoginAccount): AuthData {
    if (!loginModel.email) {
        throw Error("FirebaseAuth SignInWithEmailAndPasswordAsync email is null")
    }
    if (!loginModel.password) {
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
    if (IsNullOrWhiteSpace(email)) {
        throw Error("FirebaseAuth GetToken Error email IsNullOrWhiteSpace")
    }
    try {
        let userRecord: UserRecord = await _firebaseAuth.GetUserByEmailAsync(email);
    }
    catch (ex) {
        _logger.LogError("Exception caught in FirebaseAuth GetToken: {0}", ex);
        // TODO: throw new MyException("uring the generation of Token");
        return null;
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

        var discordPrivateToken = await _discordService.GeToken(code);

        if (!discordPrivateToken.IsSuccesful || discordPrivateToken.Content == null) {
            return new ServiceResponse<string>(messages: discordPrivateToken.Messages ?? "", messagesToShow: discordPrivateToken.MessagesToShow ?? "", content: null, isSuccesful: false);
        }

        var userInfo = await _discordService.GetUserInfoAsync(discordPrivateToken.Content);

        if (!userInfo.IsSuccesful || userInfo.Content == null) {
            return new ServiceResponse<string>(messages: userInfo.Messages ?? "", messagesToShow: userInfo.MessagesToShow ?? "", content: null, isSuccesful: false);
        }

        // * User must be verified
        if (!userInfo.Content.verified) {
            _logger.LogError("FirebaseAuth OAuthDiscordCallback: Discord account must be verified");
            return new ServiceResponse<string>(messages: "FirebaseAuth OAuthDiscordCallback: Discord account must be verified", messagesToShow: "Discord account must be verified", content: null, isSuccesful: false);
        }

        var firebaseAuthData = await GetTokenByEmail(userInfo.Content.email);

        // * User is not registered
        // * Because in case A has a DRincs account, but does not have a Discord account
        // * B using A's email can create an unverified Discord account, and then login to the DRincs account
        if (firebaseAuthData == null) {
            var userRecorder = await CreateAccount(userInfo.Content);
            firebaseAuthData = await GetTokenByEmail(userInfo.Content.email);

            if (firebaseAuthData == null) {
                _logger.LogError("FirebaseAuth OAuthDiscordCallback: authService.CreateAccount Error");
                return new ServiceResponse<string>(messages: "FirebaseAuth OAuthDiscordCallback: authService.CreateAccount Error", messagesToShow: "There was an error when creating the account", content: null, isSuccesful: false);
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