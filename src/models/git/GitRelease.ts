import { GitHubRelease, GitReleaseAsset } from "./GitHubRelease";

export class GitRelease {
    constructor(gitRelease: GitHubRelease) {
        this.tagName = gitRelease.tag_name;
        this.publishedAt = gitRelease.published_at;
        this.assets = gitRelease.assets;
    }
    tagName?: string;
    publishedAt: string;
    assets?: GitReleaseAsset[];
}