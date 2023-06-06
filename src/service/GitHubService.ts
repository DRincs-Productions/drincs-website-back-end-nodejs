import { GitHubCreateIssueBody } from "../models/git/GitHubCreateIssueBody";
import { GitHubRelease } from "../models/git/GitHubRelease";
import { GitHubTranslationRelease } from "../models/git/GitHubTranslationRelease";
import { GitRelease } from "../models/git/GitRelease";
import { isNullOrEmpty } from "../utility/UtilityFunctionts";
import { getRequestWithHeaders, postRequest } from "./BaseRestService";

async function getReleases(repositoryName: string): Promise<GitRelease[]> {
    let endpoint: string = "repos/" + repositoryName + "/releases";
    let token = process.env.API_KEY_GITHUB

    if (isNullOrEmpty(repositoryName)) {
        throw Error("GitService GetReleases repositoryName Is Null Or Empty")
    }

    if (isNullOrEmpty(token)) {
        throw Error("GitService GetReleases token Is Null Or Empty")
    }
    let headers = {
        "Authorization": "token " + token
    }

    let data = await getRequestWithHeaders<GitHubRelease[]>(endpoint, headers)
    if (!data) {
        throw Error("GitService GetReleases Data Is Null")
    }

    var resArray: GitRelease[] = [];
    data.forEach((item) => {
        resArray.push(new GitRelease(item));
    })
    return resArray
}

async function createIssue(repositoryName: string, issue: GitHubCreateIssueBody): Promise<any> {
    let endpoint: string = "repos/" + repositoryName + "/issues";
    let token = process.env.API_KEY_GITHUB

    if (isNullOrEmpty(repositoryName)) {
        throw Error("GitService CreateIssue repositoryName Is Null Or Empty")
    }

    if (isNullOrEmpty(token)) {
        throw Error("GitService CreateIssue token Is Null Or Empty")
    }

    let headers = {
        "Authorization": "token " + token,
        "Content-Type": "application/json",
    }

    return (await postRequest<any>(endpoint, issue, headers))
}

export async function getTranslationRelease(repositoryName: string): Promise<GitHubTranslationRelease[]> {
    var releases = await getReleases(repositoryName);
    if (releases == null) {
        throw Error("GetTranslationReleaseAsync GetReleasesAsync Error")
    }

    var result: GitHubTranslationRelease[] = releases.map((item) => {
        var b = new GitHubTranslationRelease();
        b.version = item.tagName?.split('/')[1];
        b.language = item.tagName?.split('/')[0];
        b.downloadUrl = item.assets && (item.assets?.length || 0) > 0 ? item.assets[0].browser_download_url : ""
        b.date = item.publishedAt;
        return b;
    })

    return result
}
