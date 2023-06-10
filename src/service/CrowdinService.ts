import { CrowdinLanguages, CrowdinLanguagesData } from "../models/translation/CrowdinLanguages";
import { CrowdinProjectInfo } from "../models/translation/CrowdinProjectInfo";
import { IsNullOrWhiteSpace } from "../utility/UtilityFunctionts";
import { getRequestWithHeaders } from "./BaseRestService";

const endpoint: string = "https://api.crowdin.com/api/v2/"

export async function getProject(projectId: string): Promise<CrowdinProjectInfo> {
    let link: string = endpoint + "projects/" + projectId;
    let token = process.env.API_KEY_CROWDIN

    if (IsNullOrWhiteSpace(projectId)) {
        throw Error("CrowdinService GetProject repositoryName Is Null Or Empty")
    }

    if (IsNullOrWhiteSpace(token)) {
        throw Error("CrowdinService GetProject token Is Null Or Empty")
    }

    let headers = {
        "Authorization": "Bearer " + token
    }

    let data = await getRequestWithHeaders<CrowdinProjectInfo>(link, headers)

    if (!data) {
        throw Error("CrowdinService GetProject Data Is Null")
    }
    return data
}

export async function GetLanguagesAsync(projectId: string): Promise<CrowdinLanguagesData[]> {
    let link: string = endpoint + "projects/" + projectId + "/languages/progress";
    let token = process.env.API_KEY_CROWDIN

    if (IsNullOrWhiteSpace(projectId)) {
        throw Error("CrowdinService GetLanguages repositoryName Is Null Or Empty")
    }

    if (IsNullOrWhiteSpace(token)) {
        throw Error("CrowdinService GetLanguages token Is Null Or Empty")
    }

    let headers = {
        "Authorization": "Bearer " + token
    }

    let data = await getRequestWithHeaders<CrowdinLanguages>(link, headers)

    if (!data || !data.data) {
        throw Error("CrowdinService GetLanguages Data Is Null")
    }
    return data.data
}
