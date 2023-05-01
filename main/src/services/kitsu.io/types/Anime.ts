import { Anime } from "@prisma/client";
import {
    AnimeSearchResponseDataAttributesAgeRating,
    AnimeSearchResponseDataAttributesCoverImage,
    AnimeSearchResponseDataAttributesPosterImage,
    AnimeSearchResponseDataAttributesPosterImageMeta,
    AnimeSearchResponseDataAttributesRatingFrequencies,
    AnimeSearchResponseDataAttributesStatus,
    AnimeSearchResponseDataAttributesSubType,
    AnimeSearchResponseDataAttributesTitles
} from "./animeSearchApiData.js";

export class AnimeData {
    createdAt: string;
    updatedAt: string;
    slug: string;
    synopsis: string;
    coverImageTopOffset: number | null;
    titles: AnimeSearchResponseDataAttributesTitles;
    canonicalTitle: string | null;
    averageRating: string | null;
    ratingFrequencies: AnimeSearchResponseDataAttributesRatingFrequencies | null;
    userCount: number | null;
    favoritesCount: number | null;
    startDate: string | null;
    endDate: string | null;
    popularityRank: number | null;
    ratingRank: number | null;
    ageRating: AnimeSearchResponseDataAttributesAgeRating | null;
    ageRatingGuide: string | null;
    subtype: AnimeSearchResponseDataAttributesSubType | null;
    status: AnimeSearchResponseDataAttributesStatus | null;
    tba: string  | null;
    posterImage: AnimeSearchResponseDataAttributesPosterImage | null;
    coverImage: AnimeSearchResponseDataAttributesCoverImage | null;
    episodeCount: number | null;
    episodeLength: number | null;
    youtubeVideoId: string | null;
    showType: AnimeSearchResponseDataAttributesSubType | null;
    nsfw: boolean | null;

    abbreviatedTitles: string[];
    genres: string[];

    constructor(data: Anime) {
        this.genres = data.genres ?? [];

        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.slug = data.slug;
        this.synopsis = data.synopsis == "" || !data.synopsis ? data.synopsisEn : data.synopsis;
        this.coverImageTopOffset = data.coverImageTopOffset ?? null;
        this.titles = {
            en: data.titles_en ?? null,
            en_jp: data.titles_enJp ?? null,
            ja_jp: data.titles_jaJp ?? null
        };
        this.canonicalTitle = data.canonicalTitle ?? null;

        this.abbreviatedTitles = data.abbreviatedTitles ?? [];
        this.averageRating = data.averageRating ?? null;
        this.ratingFrequencies = data.ratingFrequencies ? JSON.parse(data.ratingFrequencies) as AnimeSearchResponseDataAttributesRatingFrequencies : null;
        this.userCount = data.userCount ?? null;
        this.favoritesCount = data.favoritesCount ?? null;
        this.startDate = data.startDate ?? null;
        this.endDate = data.endDate ?? null;
        this.popularityRank = data.popularityRank ?? null;
        this.ratingRank = data.ratingRank ?? null;
        this.ageRating = data.ageRating ?? null;
        this.ageRatingGuide = data.ageRatingGuide ?? null;
        
        switch(data.subtype) {
        case "MOVIE": this.subtype = "movie"; break;
        case "MUSIC": this.subtype = "music"; break;
        case "SPECIAL": this.subtype = "special"; break;
        default: this.subtype = data.subtype ?? null;
        }

        switch(data.status) {
        case "CURRENT": this.status = "current"; break;
        case "FINISHED": this.status = "finished"; break;
        case "TBA": this.status = "tba"; break;
        case "UNRELEASED": this.status = "unreleased"; break;
        case "UPCOMING": this.status = "upcoming"; break;
        default: this.status = null;
        }

        this.tba = data.tba ?? null;

        this.posterImage = {
            large: data.posterImage_large ?? null,
            medium:  data.posterImage_medium ?? null,
            original:  data.posterImage_original ?? null,
            small:  data.posterImage_small ?? null,
            tiny:  data.posterImage_tiny ?? null,
            meta: data.posterImage_meta ? JSON.parse(data.posterImage_meta) as AnimeSearchResponseDataAttributesPosterImageMeta : null
        };

        this.coverImage = {
            large: data.coverImage_large ?? null,
            original: data.coverImage_original ?? null,
            small: data.coverImage_small ?? null,
            tiny: data.coverImage_tiny ?? null,
            meta: data.coverImage_meta ? JSON.parse(data.coverImage_meta) as AnimeSearchResponseDataAttributesPosterImageMeta : null
        };

        this.episodeCount = data.episodeCount ?? null;
        this.episodeLength = data.episodeLength ?? null;
        this.youtubeVideoId = data.youtubeVideoId ?? null;

        switch(data.showType) {
        case "MOVIE": this.showType = "movie"; break;
        case "MUSIC": this.showType = "music"; break;
        case "SPECIAL": this.showType = "special"; break;
        default: this.showType = data.showType ?? null;
        }

        this.nsfw = data.nsfw ?? null;
    }
}
