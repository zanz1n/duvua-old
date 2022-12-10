import { Redis } from "ioredis"
import {
    AnimeRelationshipGenresResponse
} from "./types/animeGenresApiData"
import {
    AnimeSearchResponse,
    AnimeSearchResponseData,
    AnimeSearchResponseDataAttributes,
    AnimeSearchResponseDataAttributesAgeRating,
    AnimeSearchResponseDataAttributesCoverImage,
    AnimeSearchResponseDataAttributesPosterImage,
    AnimeSearchResponseDataAttributesRatingFrequencies,
    AnimeSearchResponseDataAttributesStatus,
    AnimeSearchResponseDataAttributesSubType,
    AnimeSearchResponseDataAttributesTitles
} from "./types/animeSearchApiData"
import { Translator } from "../translator/index"

export class Anime implements AnimeSearchResponseDataAttributes {
    private _data: AnimeSearchResponseData

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
    
    public getGenres(): Promise<string[] | null> {
        return fetch(this._data.relationships.genres.links.related)
            .then(res => res.json())
            .then((data: AnimeRelationshipGenresResponse) => {
                if (!data.data[0]) return null
                const genres: string[] = []
                data.data.forEach(attr => genres.push(attr.attributes.name))
                return genres
            })
        
    }
    constructor(data: AnimeSearchResponse) {
        this._data = data.data[0]
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
    translator: Translator
    constructor(redis: Redis, translator: Translator) {
        this.redis = redis
        this.translator = translator
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
                dataAs.data[0].attributes.synopsis =
                    await this.translator.translate(dataAs.data[0].attributes.synopsis, {
                        from: "en",
                        to: "pt"
                    })
                this.redis.set(nameQuery, JSON.stringify(dataAs))
                if (!dataAs.data[0]) return null
                return new Anime(dataAs)
            }).catch(() => null)
    }
}
