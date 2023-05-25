export interface CrowdinProjectInfo {
    data?: CrowdinProjectInfoData;
}

export interface CrowdinProjectInfoData {
    logo?: string;
    name?: string;
    description?: string;
    targetLanguages?: TargetLanguages[];
}

export interface TargetLanguages {
    id?: string;
    name?: string;
    editorCode?: string;
    twoLettersCode?: string;
    threeLettersCode?: string;
    locale?: string;
    androidCode?: string;
    osxCode?: string;
    osxLocale?: string;
    pluralCategoryNames?: string[];
    pluralRules?: string;
    pluralExamples?: string[];
    textDirection?: string;
    dialectOf?: any;
}