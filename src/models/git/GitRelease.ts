import { GitReleaseAsset } from "./GitHubRelease";

export interface GitRelease {
    tagName?: string;
    publishedAt: string;
    assets?: GitReleaseAsset[];
}