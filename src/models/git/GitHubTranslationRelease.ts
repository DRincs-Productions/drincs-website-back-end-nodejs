export class GitHubTranslationRelease {
    version?: string;
    language?: string;
    downloadUrl?: string;
    date: string = (new Date).toString();
}