import { TranslationResult, TranslationResultItem } from "../models/translation/TranslationResult";
import { logInfo } from "../utility/Logger";
import { GetLanguagesAsync as getLanguages, getProject } from "./CrowdinService";
import { getTranslationRelease } from "./GitHubService";

export async function getTranslations(repositoryName: string, crowdinProjectId: string): Promise<TranslationResult> {
    logInfo("Start Translation GetTranslationsAsync")
    var releases = await getTranslationRelease(repositoryName)
    var projectInfo = await getProject(crowdinProjectId)
    var languages = await getLanguages(crowdinProjectId)

    var resultArray: TranslationResultItem[] = []
    var index = 0;

    languages.forEach((item) => {
        var translationResultItem = new TranslationResultItem();
        translationResultItem.id = index;
        translationResultItem.translated = item?.data?.phrases != null ? (item.data.phrases.translated * 100) / item.data.phrases.total : 0;
        translationResultItem.approved = item?.data?.phrases != null ? (item.data.phrases.approved * 100) / item.data.phrases.total : 0;
        translationResultItem.targetLanguages = projectInfo?.data?.targetLanguages?.find(lang => {
            // https://www.iban.com/country-codes
            if (lang.twoLettersCode?.toLowerCase() == "ja") {
                lang.twoLettersCode = "jp";
            }
            if (lang.twoLettersCode?.toLowerCase() == "zh") {
                lang.twoLettersCode = "cn";
                lang.name = "Chinese";
            }
            if (lang.twoLettersCode?.toLowerCase() == "el") {
                lang.twoLettersCode = "gr";
            }
            return lang.id?.toLowerCase() == item?.data?.languageId?.toLowerCase();
        });
        translationResultItem.release = undefined;

        releases.forEach((release) => {
            if (translationResultItem && translationResultItem.targetLanguages?.name?.toLowerCase() == release.language?.toLowerCase()) {
                if (!translationResultItem.release || new Date(translationResultItem?.release?.date) < new Date(release.date)) {
                    translationResultItem.release = release;
                }
            }
        })

        resultArray.push(translationResultItem);
        index++;
    })

    var result = new TranslationResult();
    result.list = resultArray;
    result.name = projectInfo?.data?.name;
    result.logo = projectInfo?.data?.logo;
    result.description = projectInfo?.data?.description;

    return result;
}