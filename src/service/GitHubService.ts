import { GitHubCreateIssueBody } from "../models/git/GitHubCreateIssueBody";
import { GitHubRelease } from "../models/git/GitHubRelease";
import { GitHubTranslationRelease } from "../models/git/GitHubTranslationRelease";
import { GitRelease } from "../models/git/GitRelease";
import { IsNullOrWhiteSpace } from "../utility/UtilityFunctionts";
import { getRequestWithHeaders, postRequest } from "./BaseRestService";

const endpoint = "https://api.github.com"

export async function getReleases(repositoryName: string): Promise<GitRelease[]> {
    if (IsNullOrWhiteSpace(repositoryName)) {
        throw Error("GitService getReleases projectId Is Null Or Empty")
    }

    let link: string = endpoint + "/repos/" + repositoryName + "/releases";
    let token = process.env.API_KEY_GITHUB

    if (IsNullOrWhiteSpace(token)) {
        throw Error("GitService GetReleases token Is Null Or Empty")
    }
    let headers = {
        "Authorization": "token " + token
    }

    let data = await getRequestWithHeaders<GitHubRelease[]>(link, headers)
    if (!data) {
        throw Error("GitService GetReleases Data Is Null")
    }

    let resArray: GitRelease[] = [];
    data.forEach((item) => {
        resArray.push(new GitRelease(item));
    })
    return resArray
}

export async function createIssue(repositoryName: string, issue: GitHubCreateIssueBody): Promise<any> {
    if (IsNullOrWhiteSpace(repositoryName)) {
        throw Error("GitService createIssue projectId Is Null Or Empty")
    }

    let link: string = endpoint + "/repos/" + repositoryName + "/issues";
    let token = process.env.API_KEY_GITHUB

    if (IsNullOrWhiteSpace(token)) {
        throw Error("GitService CreateIssue token Is Null Or Empty")
    }

    let headers = {
        "Authorization": "token " + token,
        "Content-Type": "application/json",
    }

    return (await postRequest<any>(link, issue, headers))
}

export async function getTranslationRelease(repositoryName: string): Promise<GitHubTranslationRelease[]> {
    let releases = await getReleases(repositoryName);
    if (!releases) {
        throw Error("GitService getTranslationRelease Error")
    }

    let result: GitHubTranslationRelease[] = releases.map((item) => {
        let b = new GitHubTranslationRelease();
        b.version = item.tagName?.split('/')[1];
        b.language = item.tagName?.split('/')[0];
        b.downloadUrl = item.assets && (item.assets?.length || 0) > 0 ? item.assets[0].browser_download_url : ""
        b.date = item.publishedAt;
        return b;
    })

    return result
}
