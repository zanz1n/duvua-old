export interface AnimeSearchResponseDataAttributesCoverImageMetaDimension {
    width: string
    height: string
}

export interface AnimeSearchResponseDataAttributesCoverImageMeta {
    dimensions: {
        tiny: AnimeSearchResponseDataAttributesCoverImageMetaDimension
        small: AnimeSearchResponseDataAttributesCoverImageMetaDimension
        large: AnimeSearchResponseDataAttributesCoverImageMetaDimension
    }
}

export interface AnimeSearchResponseDataAttributesCoverImage {
    tiny: string | null
    small: string | null
    large: string | null
    original: string | null
    meta: AnimeSearchResponseDataAttributesCoverImageMeta | null
}

export interface AnimeSearchResponseDataAttributesPosterImageMetaDimension {
    width: string
    height: string
}

export interface AnimeSearchResponseDataAttributesPosterImageMeta {
    dimensions: {
        tiny: AnimeSearchResponseDataAttributesPosterImageMetaDimension
        small: AnimeSearchResponseDataAttributesPosterImageMetaDimension
        medium: AnimeSearchResponseDataAttributesPosterImageMetaDimension
        large: AnimeSearchResponseDataAttributesPosterImageMetaDimension
    }
}

export interface AnimeSearchResponseDataAttributesPosterImage {
    tiny: string | null
    small: string | null
    medium: string | null
    large: string | null
    original: string | null
    meta: AnimeSearchResponseDataAttributesPosterImageMeta | null
}

export type AnimeSearchResponseDataAttributesStatus = "current" | "finished" | "tba" | "unreleased" | "upcoming"

export type AnimeSearchResponseDataAttributesSubType = "ONA" | "OVA" | "TV" | "movie" | "music" | "special"

export type AnimeSearchResponseDataAttributesAgeRating = "G" | "PG" | "R" | "R18"

export interface AnimeSearchResponseDataAttributesRatingFrequencies {
    "2": string
	"3": string
	"4": string
	"5": string
	"6": string
	"7": string
	"8": string
	"9": string
	"10": string
	"11": string
	"12": string
	"13": string
	"14": string
	"15": string
	"16": string
	"17": string
	"18": string
	"19": string
	"20": string
}

export interface AnimeSearchResponseDataAttributesTitles {
    en: string | null
    en_jp: string | null
    ja_jp: string | null
}

export interface AnimeSearchResponseDataAttributes {
    createdAt: string
    updatedAt: string
    slug: string
    synopsis: string
    coverImageTopOffset: number | null
    titles: AnimeSearchResponseDataAttributesTitles
    canonicalTitle: string | null
    abbreviatedTitles: string[] | null
    averageRating: string | null
    ratingFrequencies: AnimeSearchResponseDataAttributesRatingFrequencies | null
    userCount: number | null
    favoritesCount: number | null
    startDate: string | null
    endDate: string | null
    popularityRank: number | null
    ratingRank: number | null
    ageRating: AnimeSearchResponseDataAttributesAgeRating | null
    ageRatingGuide: string | null
    subtype: AnimeSearchResponseDataAttributesSubType | null
    status: AnimeSearchResponseDataAttributesStatus | null
    tba: string  | null
    posterImage: AnimeSearchResponseDataAttributesPosterImage | null
    coverImage: AnimeSearchResponseDataAttributesCoverImage | null
    episodeCount: number | null
    episodeLength: number | null
    youtubeVideoId: string | null
    showType: AnimeSearchResponseDataAttributesSubType | null
    nsfw: boolean | null
}

export interface AnimeSearchResponseDataRelationship {
    links: {
        self: string
        related: string
    }
}

export interface AnimeSearchResponseDataRelationships {
    genres: AnimeSearchResponseDataRelationship
    categories: AnimeSearchResponseDataRelationship
    castings: AnimeSearchResponseDataRelationship
    installments: AnimeSearchResponseDataRelationship
    mappings: AnimeSearchResponseDataRelationship
    reviews: AnimeSearchResponseDataRelationship
    mediaRelationships: AnimeSearchResponseDataRelationship
    characters: AnimeSearchResponseDataRelationship
    staff: AnimeSearchResponseDataRelationship
    productions: AnimeSearchResponseDataRelationship
    quotes: AnimeSearchResponseDataRelationship
    episodes: AnimeSearchResponseDataRelationship
    streamingLinks: AnimeSearchResponseDataRelationship
    animeProductions: AnimeSearchResponseDataRelationship
    animeCharacters: AnimeSearchResponseDataRelationship
    animeStaff: AnimeSearchResponseDataRelationship
}

export interface AnimeSearchResponseData {
    id: string
    type: "anime"
    links: {
        self: string
    }
    attributes: AnimeSearchResponseDataAttributes
    relationships: AnimeSearchResponseDataRelationships
}

export interface AnimeSearchResponseMeta {
    count: number
}

export interface AnimeSearchResponseLinks {
    first: string
    next: string
    last: string
}

export interface AnimeSearchResponse {
    data: AnimeSearchResponseData[]
    meta: AnimeSearchResponseMeta
    links: AnimeSearchResponseLinks
}
