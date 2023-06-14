// * must be equal to client side enum TranslationProjectsEnum
export enum ProjectsEnum {
    AFamilyVenture,
    AmityPark,
    BigBrotherAS,
    BadMemories,
    WitchHunter,
}

type ProjectsData = {
    github: string,
    crowdin: string,
    crowdinLink: string,
}

export function getTranslationValuesByEnum(id: ProjectsEnum): ProjectsData {
    switch (id) {
        case ProjectsEnum.AFamilyVenture:
            return { crowdin: "492487", github: "DonRP/AFV", crowdinLink: "https://crowdin.com/project/a-family-venture" }
        case ProjectsEnum.AmityPark:
            return { crowdin: "528084", github: "DonRP/AmityPark", crowdinLink: "https://crowdin.com/project/amity-park" }
        case ProjectsEnum.BigBrotherAS:
            return { crowdin: "461654", github: "DonRP/BBAS", crowdinLink: "https://crowdin.com/project/big-brother-as" }
        case ProjectsEnum.BadMemories:
            return { crowdin: "507994", github: "DonRP/BM", crowdinLink: "https://crowdin.com/project/bad-memories" }
        case ProjectsEnum.WitchHunter:
            return { crowdin: "557133", github: "DonRP/WitchHunter", crowdinLink: "https://crowdin.com/project/witch-hunter" }
        default:
            throw Error("TranslationProjectsEnum not found")
    }
}
