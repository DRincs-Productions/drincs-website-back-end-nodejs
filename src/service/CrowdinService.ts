import { CrowdinLanguages, CrowdinLanguagesData } from "../models/translation/CrowdinLanguages";
import { CrowdinProjectInfo } from "../models/translation/CrowdinProjectInfo";
import { IsNullOrWhiteSpace } from "../utility/UtilityFunctionts";
import { getRequestWithHeaders } from "./BaseRestService";

const endpoint: string = "https://api.crowdin.com/api/v2"

export async function getProject(projectId: string): Promise<CrowdinProjectInfo> {
    if (IsNullOrWhiteSpace(projectId)) {
        throw Error("CrowdinService getProject projectId Is Null Or Empty")
    }

    let link: string = endpoint + "/projects/" + projectId;
    let token = process.env.API_KEY_CROWDIN

    if (IsNullOrWhiteSpace(token)) {
        throw Error("CrowdinService getProject token Is Null Or Empty")
    }

    let headers = {
        "Authorization": "Bearer " + token
    }

    let data = await getRequestWithHeaders<CrowdinProjectInfo>(link, headers)

    if (!data) {
        throw Error("CrowdinService getProject Data Is Null")
    }
    return data
}

export async function getLanguages(projectId: string): Promise<CrowdinLanguagesData[]> {
    if (IsNullOrWhiteSpace(projectId)) {
        throw Error("CrowdinService getLanguages projectId Is Null Or Empty")
    }

    let link: string = endpoint + "/projects/" + projectId + "/languages/progress";
    let token = process.env.API_KEY_CROWDIN

    if (IsNullOrWhiteSpace(token)) {
        throw Error("CrowdinService getLanguages token Is Null Or Empty")
    }

    let headers = {
        "Authorization": "Bearer " + token
    }

    let data = await getRequestWithHeaders<CrowdinLanguages>(link, headers)

    if (!data || !data.data) {
        throw Error("CrowdinService getLanguages Data Is Null")
    }
    return data.data
}
