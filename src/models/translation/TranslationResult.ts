import { GitHubTranslationRelease } from "../git/GitHubTranslationRelease";
import { TargetLanguages } from "./CrowdinProjectInfo";

export interface TranslationResult {
    list?: TranslationResultItem[];
    name?: string;
    logo?: string;
    description?: string;
}

export interface TranslationResultItem {
    id: number;
    translated: number;
    approved: number;
    release?: GitHubTranslationRelease;
    targetLanguages?: TargetLanguages;
}