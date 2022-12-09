import { Redis } from "ioredis"

type AnimeSearchResponseDataAttributesCoverImageMetaDimension = {
    width: string
    height: string
}

type AnimeSearchResponseDataAttributesCoverImageMeta = {
    dimensions: {
        tiny: AnimeSearchResponseDataAttributesCoverImageMetaDimension
        small: AnimeSearchResponseDataAttributesCoverImageMetaDimension
        large: AnimeSearchResponseDataAttributesCoverImageMetaDimension
    }
}

type AnimeSearchResponseDataAttributesCoverImage = {
    tiny: string
    small: string
    large: string
    original: string
    meta: AnimeSearchResponseDataAttributesCoverImageMeta
}

type AnimeSearchResponseDataAttributesPosterImageMetaDimension = {
    width: string
    height: string
}

type AnimeSearchResponseDataAttributesPosterImageMeta = {
    dimensions: {
        tiny: AnimeSearchResponseDataAttributesPosterImageMetaDimension
        small: AnimeSearchResponseDataAttributesPosterImageMetaDimension
        medium: AnimeSearchResponseDataAttributesPosterImageMetaDimension
        large: AnimeSearchResponseDataAttributesPosterImageMetaDimension
    }
}

type AnimeSearchResponseDataAttributesPosterImage = {
    tiny: string
    small: string
    medium: string
    large: string
    original: string
    meta: AnimeSearchResponseDataAttributesPosterImageMeta
}

type AnimeSearchResponseDataAttributesStatus = "current" | "finished" | "tba" | "unreleased" | "upcoming"

type AnimeSearchResponseDataAttributesSubType = "ONA" | "OVA" | "TV" | "movie" | "music" | "special"

type AnimeSearchResponseDataAttributesAgeRating = "G" | "PG" | "R" | "R18"

type AnimeSearchResponseDataAttributesRatingFrequencies = {
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

type AnimeSearchResponseDataAttributesTitles = {
    en: string
    en_jp: string
    ja_jp: string
}

type AnimeSearchResponseDataAttributes = {
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

type AnimeSearchResponseDataRelationship = {
    links: {
        self: string
        related: string
    }
}

type AnimeSearchResponseDataRelationships = {
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

type AnimeSearchResponseData = {
    id: string
    type: "anime"
    links: {
        self: string
    }
    attributes: AnimeSearchResponseDataAttributes
    relationships: AnimeSearchResponseDataRelationships
}

type AnimeSearchResponseMeta = {
    count: number
}

type AnimeSearchResponseLinks = {
    first: string
    next: string
    last: string
}

type AnimeSearchResponse = {
    data: AnimeSearchResponseData[]
    meta: AnimeSearchResponseMeta
    links: AnimeSearchResponseLinks
}

export class Anime {
    public createdAt: string
    public updatedAt: string
    public slug: string
    public synopsis: string
    public coverImageTopOffset: number
    public titles: AnimeSearchResponseDataAttributesTitles
    public canonicalTitle: string
    public abbreviatedTitles: string[]
    public averageRating: string
    public ratingFrequencies: AnimeSearchResponseDataAttributesRatingFrequencies
    public userCount: number
    public favoritesCount: number
    public startDate: string
    public endDate: string
    public popularityRank: number
    public ratingRank: number
    public ageRating: AnimeSearchResponseDataAttributesAgeRating
    public ageRatingGuide: string
    public subtype: AnimeSearchResponseDataAttributesSubType
    public status: AnimeSearchResponseDataAttributesStatus
    public tba: string
    public posterImage: AnimeSearchResponseDataAttributesPosterImage
    public coverImage: AnimeSearchResponseDataAttributesCoverImage
    public episodeCount: number
    public episodeLength: number
    public youtubeVideoId: string
    public showType: AnimeSearchResponseDataAttributesSubType
    public nsfw: boolean
    constructor(data: AnimeSearchResponse) {
        this.createdAt = data.data[0].attributes.createdAt
        this.updatedAt = data.data[0].attributes.updatedAt
        this.slug = data.data[0].attributes.slug
        this.synopsis = data.data[0].attributes.synopsis
        this.coverImageTopOffset = data.data[0].attributes.coverImageTopOffset
        this.titles = data.data[0].attributes.titles
        this.canonicalTitle = data.data[0].attributes.canonicalTitle
        this.abbreviatedTitles = data.data[0].attributes.abbreviatedTitles
        this.averageRating = data.data[0].attributes.averageRating
        this.ratingFrequencies = data.data[0].attributes.ratingFrequencies
        this.userCount = data.data[0].attributes.userCount
        this.favoritesCount = data.data[0].attributes.favoritesCount
        this.startDate = data.data[0].attributes.startDate
        this.endDate = data.data[0].attributes.endDate
        this.popularityRank = data.data[0].attributes.popularityRank
        this.ratingRank = data.data[0].attributes.ratingRank
        this.ageRating = data.data[0].attributes.ageRating
        this.ageRatingGuide = data.data[0].attributes.ageRatingGuide
        this.subtype = data.data[0].attributes.subtype
        this.status = data.data[0].attributes.status
        this.tba = data.data[0].attributes.tba
        this.posterImage = data.data[0].attributes.posterImage
        this.coverImage = data.data[0].attributes.coverImage
        this.episodeCount = data.data[0].attributes.episodeCount
        this.episodeLength = data.data[0].attributes.episodeLength
        this.youtubeVideoId = data.data[0].attributes.youtubeVideoId
        this.showType = data.data[0].attributes.showType
        this.nsfw = data.data[0].attributes.nsfw
    }
}

export class Kitsu {
    redis: Redis
    constructor(redis: Redis) {
        this.redis = redis
    }

    public getAnimeFromName = async (name: string) => {
        const nameQuery = name.split(" ").join("-").toLowerCase()

        const cache = await this.redis.get(nameQuery)

        if (cache) {
            const cacheData = JSON.parse(cache) as AnimeSearchResponse
            return new Anime(cacheData)
        }
    
        return fetch(`https://kitsu.io/api/edge/anime?filter[text]=${nameQuery}`)
            .then(res => res.json())
            .then(async (data) => {
                const dataAs = data as AnimeSearchResponse
                this.redis.set(nameQuery, JSON.stringify(dataAs))
                if (!dataAs.data[0]) return null
                return new Anime(dataAs)
            }).catch(() => null)
    }
}
