import { MyError } from "../models/MyError";
import { DiscordTokenRespons } from "../models/auth/DiscordTokenRespons";
import { DiscordUserInfo } from "../models/auth/DiscordUserInfo";
import { IsNullOrWhiteSpace, getWebApiUrl, } from "../utility/UtilityFunctionts";
import { getRequestWithHeaders, postRequest } from "./BaseRestService";

export async function geTokenDiscord(code: string): Promise<string> {
    // https://miniorange.com/atlassian/rest-api-authentication-using-discord-as-oauth-provider/
    let clientId = process.env.API_KEY_DISCORD_CLIENT_ID
    let clientSecret = process.env.API_KEY_DISCORD_CLIENT_SECRET

    let headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }

    let body = {
        "client_id": clientId,
        "client_secret": clientSecret,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": getWebApiUrl() + "/auth/OAuthDiscordCallback",
    }

    let data = await postRequest<DiscordTokenRespons>("", body, headers)

    if (data?.access_token == null) {
        throw new MyError("Exception caught in DiscordService GeToken", "DiscordService GeToken: response.Data?.access_token is null")
    }
    return data?.access_token
}

export async function getUserInfoDiscord(token: string): Promise<DiscordUserInfo> {
    if (IsNullOrWhiteSpace(token)) {
        throw Error("DiscordService GetUserInfoAsync token Is Null Or Empty")
    }

    let headers = {
        "Authorization": "Bearer " + token
    }

    let data = await getRequestWithHeaders<DiscordUserInfo>("", headers)

    if (data == null) {
        throw Error("DiscordService GetUserInfoAsync Data Is Null")
    }

    return data
}
