// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.18.0
// source: queries.sql

package dba

import (
	"context"

	"github.com/lib/pq"
)

const getOneAnimeBySlug = `-- name: GetOneAnimeBySlug :one
SELECT id, "kitsuId", slug, "createdAt", "updatedAt", "startDate", "endDate", synopsis, "synopsisEn", "coverImageTopOffset", titles_en, "titles_enJp", "titles_jaJp", "canonicalTitle", "abbreviatedTitles", "averageRating", "ratingFrequencies", "userCount", "favoritesCount", "popularityRank", "ratingRank", "ageRating", "ageRatingGuide", subtype, status, tba, "posterImage_tiny", "posterImage_small", "posterImage_medium", "posterImage_large", "posterImage_original", "posterImage_meta", "coverImage_tiny", "coverImage_small", "coverImage_large", "coverImage_original", "coverImage_meta", "episodeCount", "episodeLength", "youtubeVideoId", "showType", nsfw, genres FROM "Anime" WHERE "slug" = $1
`

func (q *Queries) GetOneAnimeBySlug(ctx context.Context, slug string) (Anime, error) {
	row := q.db.QueryRowContext(ctx, getOneAnimeBySlug, slug)
	var i Anime
	err := row.Scan(
		&i.ID,
		&i.KitsuId,
		&i.Slug,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.StartDate,
		&i.EndDate,
		&i.Synopsis,
		&i.SynopsisEn,
		&i.CoverImageTopOffset,
		&i.TitlesEn,
		&i.TitlesEnJp,
		&i.TitlesJaJp,
		&i.CanonicalTitle,
		pq.Array(&i.AbbreviatedTitles),
		&i.AverageRating,
		&i.RatingFrequencies,
		&i.UserCount,
		&i.FavoritesCount,
		&i.PopularityRank,
		&i.RatingRank,
		&i.AgeRating,
		&i.AgeRatingGuide,
		&i.Subtype,
		&i.Status,
		&i.Tba,
		&i.PosterImageTiny,
		&i.PosterImageSmall,
		&i.PosterImageMedium,
		&i.PosterImageLarge,
		&i.PosterImageOriginal,
		&i.PosterImageMeta,
		&i.CoverImageTiny,
		&i.CoverImageSmall,
		&i.CoverImageLarge,
		&i.CoverImageOriginal,
		&i.CoverImageMeta,
		&i.EpisodeCount,
		&i.EpisodeLength,
		&i.YoutubeVideoId,
		&i.ShowType,
		&i.Nsfw,
		pq.Array(&i.Genres),
	)
	return i, err
}
