import { GitHubTranslationRelease } from "../git/GitHubTranslationRelease";
import { TargetLanguages } from "./CrowdinProjectInfo";

export class TranslationResult {
    list?: TranslationResultItem[];
    name?: string;
    logo?: string;
    description?: string;
}

export class TranslationResultItem {
    id: number = 0;
    translated: number = 0;
    approved: number = 0;
    release?: GitHubTranslationRelease;
    targetLanguages?: TargetLanguages;
}