export interface CrowdinLanguages {
    data?: CrowdinLanguagesData[];
}

export interface CrowdinLanguagesData {
    data?: CrowdinLanguagesDataData;
}

export interface CrowdinLanguagesDataData {
    languageId?: string;
    words?: CrowdinLanguagesDataPhrases;
    phrases?: CrowdinLanguagesDataPhrases;
    translationProgress: number;
    approvalProgress: number;
}

export interface CrowdinLanguagesDataPagination {
    offset: number;
    limit: number;
}

export interface CrowdinLanguagesDataPhrases {
    total: number;
    translated: number;
    approved: number;
}