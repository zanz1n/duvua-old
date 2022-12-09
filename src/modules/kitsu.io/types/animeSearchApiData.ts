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
    tiny: string
    small: string
    large: string
    original: string
    meta: AnimeSearchResponseDataAttributesCoverImageMeta
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
    tiny: string
    small: string
    medium: string
    large: string
    original: string
    meta: AnimeSearchResponseDataAttributesPosterImageMeta
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
    en: string
    en_jp: string
    ja_jp: string
}

export interface AnimeSearchResponseDataAttributes {
    createdAt: string
    updatedAt: string
    slug: string
    synopsis: string
    coverImageTopOffset: number
    titles: AnimeSearchResponseDataAttributesTitles
    canonicalTitle: string
    abbreviatedTitles: string[]
    averageRating: string
    ratingFrequencies: AnimeSearchResponseDataAttributesRatingFrequencies
    userCount: number
    favoritesCount: number
    startDate: string
    endDate: string
    popularityRank: number
    ratingRank: number
    ageRating: AnimeSearchResponseDataAttributesAgeRating
    ageRatingGuide: string
    subtype: AnimeSearchResponseDataAttributesSubType
    status: AnimeSearchResponseDataAttributesStatus
    tba: string
    posterImage: AnimeSearchResponseDataAttributesPosterImage
    coverImage: AnimeSearchResponseDataAttributesCoverImage
    episodeCount: number
    episodeLength: number
    youtubeVideoId: string
    showType: AnimeSearchResponseDataAttributesSubType
    nsfw: boolean
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
