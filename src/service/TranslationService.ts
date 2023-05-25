import { ServiceResponse } from "../models/ServiceResponse";
import { TranslationResult, TranslationResultItem } from "../models/translation/TranslationResult";
import { getTranslationRelease } from "./GitHubService";

export function getTranslations(repositoryName: string, crowdinProjectId: string): ServiceResponse<TranslationResult> {
    console.info("Start Translation GetTranslationsAsync");
    var releases = getTranslationRelease(repositoryName);
    var projectInfo = (await getProjectAsync(crowdinProjectId));
    var languages = (await getLanguagesAsync(crowdinProjectId));

    if (!projectInfo.IsSuccesful || releases.Content == null) {
        throw Error(projectInfo.Messages)
    }

    if (!languages.IsSuccesful || languages.Content == null) {
        throw Error(languages.Messages)
    }

    var resultArray: TranslationResultItem[] = []
    var index = 0;

    foreach(var item in languages.Content)
    {
        var translationResultItem = new TranslationResultItem();
        translationResultItem.Id = index;
        translationResultItem.Translated = item?.Data?.Phrases != null ? (item.Data.Phrases.Translated * 100) / item.Data.Phrases.Total : 0;
        translationResultItem.Approved = item?.Data?.Phrases != null ? (item.Data.Phrases.Approved * 100) / item.Data.Phrases.Total : 0;
        translationResultItem.TargetLanguages = projectInfo?.Content?.Data?.TargetLanguages?.ToList().Find(lang => {
            // https://www.iban.com/country-codes
            if (lang.TwoLettersCode.ToLower() == "ja") {
                lang.TwoLettersCode = "jp";
            }
            if (lang.TwoLettersCode.ToLower() == "zh") {
                lang.TwoLettersCode = "cn";
                lang.Name = "Chinese";
            }
            if (lang.TwoLettersCode.ToLower() == "el") {
                lang.TwoLettersCode = "gr";
            }
            return lang.Id?.ToLower() == item?.Data?.LanguageId?.ToLower();
        });
        translationResultItem.Release = null;

        foreach(var release in releases.Content)
        {
            if (translationResultItem == null) continue;

            if (translationResultItem.TargetLanguages?.Name?.ToLower() == release.Language?.ToLower()) {
                if (translationResultItem.Release == null || translationResultItem?.Release?.Date < release.Date) {
                    translationResultItem.Release = release;
                }
            }
        }

        resultArray.Add(translationResultItem);
        index++;
    }

    var result = new TranslationResult();
    result.List = resultArray;
    result.Name = projectInfo?.Content?.Data?.Name;
    result.Logo = projectInfo?.Content?.Data?.Logo;
    result.Description = projectInfo?.Content?.Data?.Description;

    return new ServiceResponse<TranslationResult>(result, isSuccesful: true);
}