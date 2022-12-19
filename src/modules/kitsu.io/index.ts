import { Translator } from "../translator"
import { logger } from "../logger"
import { AnimeAttributesStatus, AnimeAttributesSubType, PrismaClient } from "@prisma/client"

import { AnimeData } from "./types/Anime"
import { AnimeSearchResponse } from "./types/animeSearchApiData"
import { AnimeRelationshipGenresResponse } from "./types/animeGenresApiData"
import { Redis } from "ioredis"

export class Kitsu {
    prisma: PrismaClient
    translator: Translator
    redis: Redis
    constructor(prisma: PrismaClient, translator: Translator, redis: Redis) {
        this.prisma = prisma
        this.translator = translator
        this.redis = redis
    }

    public getAnimeFromName = async (name: string): Promise<AnimeData | null> => {
        const nameQuery = name.split(" ").join("-").toLowerCase()

        const blacklist = await this.redis.get("anime-name-query-blacklist")
        if (blacklist) {
            const blJson = JSON.parse(blacklist) as string[]
            if (blJson.includes(nameQuery)) return null
        }

        const animeDb = await this.prisma.anime.findFirst({
            where: {
                relationalRefs: {
                    some: {
                        value: nameQuery
                    }
                }
            }
        })

        if (animeDb) {
            logger.debug("Find relation")
            return new AnimeData(animeDb)
        }

        logger.debug("Don't find relation")

        const data = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${nameQuery}`)
            .then(res => res.json().catch(() => null)) as AnimeSearchResponse
        
        if (!data.data[0]) {
            this.redis.get("anime-name-query-blacklist")
                .then(async (bl) => {
                    let newBlackList: string[]
                    if (!bl) {
                        newBlackList = []
                    } else {
                        newBlackList = (JSON.parse(bl) as string[])
                    }
                    newBlackList.push(nameQuery)
                    await this.redis.set("anime-name-query-blacklist", JSON.stringify(newBlackList), "EX", 600)
                })
            return null
        }

        const genresData = fetch(data.data[0].relationships.genres.links.related)
            .then(res => res.json()) as Promise<AnimeRelationshipGenresResponse>

        const { attributes } = data.data[0]

        let animeDbFromKitsuId = await this.prisma.anime.findFirst({
            where: {
                kitsuId: data.data[0].id
            }
        })

        const genres: string[] = [];

        (await genresData).data.forEach(dt => genres.push(dt.attributes.name ?? ""))

        if (!animeDbFromKitsuId) {
            logger.debug("Don't find DB ... creating")
            animeDbFromKitsuId = await this.prisma.anime.create({
                data: {
                    // THIS SYNTAX CAUSE AN UNEXPECTED BUG EVEN IF NON EQUAL PROPRERTIES OVERWRITEN
                    // ...attributes,
                    kitsuId: data.data[0].id,
                    synopsis: "",
                    synopsisEn: attributes.synopsis,
                    coverImage_large: attributes.coverImage?.large,
                    coverImage_meta: attributes.coverImage?.meta ? JSON.stringify(attributes.coverImage.meta) : null,
                    coverImage_original: attributes.coverImage?.original,
                    coverImage_small: attributes.coverImage?.small,
                    coverImage_tiny: attributes.coverImage?.tiny,
                    posterImage_large: attributes.posterImage?.large,
                    posterImage_medium: attributes.posterImage?.medium,
                    posterImage_original: attributes.posterImage?.original,
                    posterImage_small: attributes.posterImage?.small,
                    posterImage_tiny: attributes.posterImage?.tiny,
                    posterImage_meta: attributes.posterImage?.meta ? JSON.stringify(attributes.posterImage.meta) : null,
                    ratingFrequencies: attributes.ratingFrequencies ? JSON.stringify(attributes.ratingFrequencies) : null,
                    showType: attributes.showType ? attributes.showType.toUpperCase() as AnimeAttributesSubType : undefined,
                    status: attributes.status ? attributes.status.toUpperCase() as AnimeAttributesStatus : undefined,
                    subtype: attributes.subtype ? attributes.subtype.toUpperCase() as AnimeAttributesSubType : undefined,
                    titles_en: attributes.titles.en,
                    titles_enJp: attributes.titles.en_jp,
                    titles_jaJp: attributes.titles.ja_jp,
                    abbreviatedTitles: attributes.abbreviatedTitles ?? [],
                    genres,

                    createdAt: attributes.createdAt,
                    slug: attributes.slug,
                    updatedAt: attributes.updatedAt,
                    ageRating: attributes.ageRating,
                    ageRatingGuide: attributes.ageRatingGuide,
                    averageRating: attributes.averageRating,
                    canonicalTitle: attributes.canonicalTitle,
                    coverImageTopOffset: attributes.coverImageTopOffset,
                    endDate: attributes.endDate,
                    episodeCount: attributes.episodeCount,
                    episodeLength: attributes.episodeLength,
                    favoritesCount: attributes.favoritesCount,
                    nsfw: attributes.nsfw,
                    popularityRank: attributes.popularityRank,
                    ratingRank: attributes.ratingRank,
                    startDate: attributes.startDate,
                    tba: attributes.tba,
                    userCount: attributes.userCount,
                    youtubeVideoId: attributes.youtubeVideoId
                }
            })
        }
        await this.prisma.animeReference.create({
            data: {
                value: nameQuery,
                anime: {
                    connect: {
                        id: animeDbFromKitsuId.id
                    }
                }
            }
        })

        return new AnimeData(animeDbFromKitsuId)
    }
}
