import { CrowdinLanguages, CrowdinLanguagesData } from "../models/translation/CrowdinLanguages";
import { CrowdinProjectInfo } from "../models/translation/CrowdinProjectInfo";
import { IsNullOrWhiteSpace, onlyLettersAndNumbers } from "../utility/UtilityFunctionts";
import { getRequestWithHeaders } from "./BaseRestService";

const endpoint: string = "https://api.crowdin.com/api/v2"

function checkProjectId(projectId: string): boolean {
    if (IsNullOrWhiteSpace(projectId)) {
        throw Error("CrowdinService GetProject projectId Is Null Or Empty")
    }

    if (!onlyLettersAndNumbers(projectId)) {
        throw Error("CrowdinService GetProject projectId Is SSRF:" + projectId)
    }

    return true
}

export async function getProject(projectId: string): Promise<CrowdinProjectInfo> {
    if (!checkProjectId(projectId)) {
        throw Error("CrowdinService GetProject projectId Error")
    }

    let link: string = endpoint + "/projects/" + projectId;
    let token = process.env.API_KEY_CROWDIN

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

export async function getLanguages(projectId: string): Promise<CrowdinLanguagesData[]> {
    if (!checkProjectId(projectId)) {
        throw Error("CrowdinService getLanguages projectId Error")
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
