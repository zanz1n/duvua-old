-- name: GetOneAnimeBySlug :one
SELECT * FROM "Anime" WHERE "slug" = $1;
