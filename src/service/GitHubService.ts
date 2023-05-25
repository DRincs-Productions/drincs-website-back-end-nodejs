import { ServiceResponse } from "../models/ServiceResponse";
import { GitHubTranslationRelease } from "../models/git/GitHubTranslationRelease";
import { GitRelease } from "../models/git/GitRelease";
import { isNullOrEmpty } from "../utility/UtilityFunctionts";

function getReleases(repositoryName: string): ServiceResponse<GitRelease[]> {
    let endpoint: string = "repos/" + repositoryName + "/releases";

    if (isNullOrEmpty(repositoryName)) {
        throw Error("GitService GetReleases repositoryName Is Null Or Empty")
    }

    if (isNullOrEmpty(token)) {
        throw Error("GitService GetReleases token Is Null Or Empty")
    }

    var request = new RestRequest(endpoint, Method.Get);
    request.AddHeader("Authorization", "token " + token);
    try {
        var response = await client.ExecuteAsync<IEnumerable<GitHubRelease>>(request);
        if (!response.IsSuccessful) {
            throw Error("GitService GetReleases Is Not Successful")
        }

        var data = response.Data;

        if (data == null) {
            throw Error("GitService GetReleases Data Is Null")
        }

        var resArray: GitRelease[] = [];
        foreach(var item in data)
        {
            resArray.Add(new GitRelease(item));
        }
        return new ServiceResponse<IEnumerable<GitRelease>>(resArray, isSuccesful: true);
    }
    catch (MyException ex)
    {
        return new ServiceResponse<IEnumerable<GitRelease>>(messages: "GitService GetReleases: " + ex.MessagesToShow, messagesToShow: ex.MessagesToShow, content: null, isSuccesful: false);
    }
    catch (Exception ex)
    {
        _logger.LogError("Exception caught in GitService GetReleases: {0}", ex);
        throw;
    }
}

function createIssue(repositoryName: string, issue: GitHubCreateIssueBody): ServiceResponse<any> {
    let endpoint: string = "repos/" + repositoryName + "/issues";

    if (isNullOrEmpty(repositoryName)) {
        throw Error("GitService CreateIssue repositoryName Is Null Or Empty")
    }

    if (isNullOrEmpty(token)) {
        throw Error("GitService CreateIssue token Is Null Or Empty")
    }

    var request = new RestRequest(endpoint, Method.Post);
    request.AddHeader("Authorization", "token " + token);
    request.AddHeader("Content-Type", "application/json");
    var body = JsonConvert.SerializeObject(issue);
    request.AddParameter("application/json", body, ParameterType.RequestBody);
    try {
        var response = await client.ExecuteAsync<IEnumerable<GitHubRelease>>(request);
        if (!response.IsSuccessful) {
            return new ServiceResponse<object>(messages: "GitService CreateIssue Is Not Successful", response.Data, isSuccesful: false);
        }

        return new ServiceResponse<object>(response.Data, isSuccesful: true);
    }
    catch (MyException ex)
    {
        return new ServiceResponse<object>(messages: "GitService CreateIssue: " + ex.MessagesToShow, messagesToShow: ex.MessagesToShow, content: null, isSuccesful: false);
    }
    catch (Exception ex)
    {
        _logger.LogError("Exception caught in GitService CreateIssue: {0}", ex);
        throw;
    }
}

export function getTranslationReleaseAsync(repositoryName: string): ServiceResponse<GitHubTranslationRelease[]> {
    var releases = await getReleases(repositoryName);
    if (releases == null || releases.Content == null || !releases.IsSuccesful) {
        return new ServiceResponse<GitHubTranslationRelease[]>(messages: releases?.Messages ?? "GetTranslationReleaseAsync GetReleasesAsync Error", null, isSuccesful: false);
    }

    var result = releases.Content.ToList().ConvertAll(item => {
        var b = new GitHubTranslationRelease();
        b.Version = item.TagName?.Split('/')[1];
        b.Language = item.TagName?.Split('/')[0];
        b.DownloadUrl = item.Assets?.ToList().FirstOrDefault()?.browser_download_url!;
        b.Date = item.PublishedAt;
        return b;
    });

    return new ServiceResponse<GitHubTranslationRelease[]>("", true);
}
