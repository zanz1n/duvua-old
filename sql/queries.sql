-- name: GetOneAnimeBySlug :one
SELECT * FROM "Anime" WHERE "slug" = $1;

-- name: GetOneAnimeByReference :one
SELECT * FROM "Anime" WHERE "id" = (SELECT "animeId" FROM "AnimeReference" WHERE "value" = $1);
