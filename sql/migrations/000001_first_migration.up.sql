-- CreateEnum
CREATE TYPE "AnimeAttributesAgeRating" AS ENUM ('G', 'PG', 'R', 'R18');

-- CreateEnum
CREATE TYPE "AnimeAttributesSubType" AS ENUM ('ONA', 'OVA', 'TV', 'MOVIE', 'MUSIC', 'SPECIAL');

-- CreateEnum
CREATE TYPE "AnimeAttributesStatus" AS ENUM ('CURRENT', 'FINISHED', 'TBA', 'UNRELEASED', 'UPCOMING');

-- CreateEnum
CREATE TYPE "MemberJob" AS ENUM ('MENDIGO');

-- CreateEnum
CREATE TYPE "WCType" AS ENUM ('MESSAGE', 'IMAGE', 'EMBED');

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "MCID" VARCHAR(40) NOT NULL,
    "silverCoins" INTEGER NOT NULL DEFAULT 0,
    "XP" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,
    "dj" BOOLEAN NOT NULL DEFAULT false,
    "playAllowed" BOOLEAN NOT NULL DEFAULT false,
    "guildId" VARCHAR(20) NOT NULL,
    "userId" VARCHAR(20) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dcId" VARCHAR(20) NOT NULL,
    "lastDailyReq" TEXT NOT NULL,
    "job" "MemberJob" NOT NULL DEFAULT 'MENDIGO',
    "goldCoins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dcId" VARCHAR(20) NOT NULL,
    "prefix" VARCHAR(4) NOT NULL DEFAULT '-',
    "enableTickets" BOOLEAN NOT NULL DEFAULT true,
    "musicStrictM" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Welcome" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "channelId" VARCHAR(20),
    "message" VARCHAR(255) NOT NULL DEFAULT 'Seja Bem Vind@ ao servidor USER',
    "type" "WCType" NOT NULL DEFAULT 'MESSAGE',
    "guildDcId" VARCHAR(20) NOT NULL,

    CONSTRAINT "Welcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anime" (
    "id" SERIAL NOT NULL,
    "kitsuId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "startDate" TEXT,
    "endDate" TEXT,
    "synopsis" TEXT NOT NULL,
    "synopsisEn" TEXT NOT NULL,
    "coverImageTopOffset" INTEGER,
    "titles_en" TEXT,
    "titles_enJp" TEXT,
    "titles_jaJp" TEXT,
    "canonicalTitle" TEXT,
    "abbreviatedTitles" TEXT[],
    "averageRating" TEXT,
    "ratingFrequencies" TEXT,
    "userCount" INTEGER,
    "favoritesCount" INTEGER,
    "popularityRank" INTEGER,
    "ratingRank" INTEGER,
    "ageRating" "AnimeAttributesAgeRating",
    "ageRatingGuide" TEXT,
    "subtype" "AnimeAttributesSubType",
    "status" "AnimeAttributesStatus",
    "tba" TEXT,
    "posterImage_tiny" TEXT,
    "posterImage_small" TEXT,
    "posterImage_medium" TEXT,
    "posterImage_large" TEXT,
    "posterImage_original" TEXT,
    "posterImage_meta" TEXT,
    "coverImage_tiny" TEXT,
    "coverImage_small" TEXT,
    "coverImage_large" TEXT,
    "coverImage_original" TEXT,
    "coverImage_meta" TEXT,
    "episodeCount" INTEGER,
    "episodeLength" INTEGER,
    "youtubeVideoId" TEXT,
    "showType" "AnimeAttributesSubType",
    "nsfw" BOOLEAN,
    "genres" TEXT[],

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimeReference" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "animeId" INTEGER NOT NULL,

    CONSTRAINT "AnimeReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_MCID_key" ON "Member"("MCID");

-- CreateIndex
CREATE INDEX "Member_id_MCID_idx" ON "Member"("id", "MCID");

-- CreateIndex
CREATE UNIQUE INDEX "User_dcId_key" ON "User"("dcId");

-- CreateIndex
CREATE INDEX "User_id_dcId_idx" ON "User"("id", "dcId");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_dcId_key" ON "Guild"("dcId");

-- CreateIndex
CREATE INDEX "Guild_dcId_id_idx" ON "Guild"("dcId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Welcome_guildDcId_key" ON "Welcome"("guildDcId");

-- CreateIndex
CREATE INDEX "Welcome_guildDcId_id_idx" ON "Welcome"("guildDcId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Anime_kitsuId_key" ON "Anime"("kitsuId");

-- CreateIndex
CREATE INDEX "Anime_id_kitsuId_idx" ON "Anime"("id", "kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeReference_value_key" ON "AnimeReference"("value");

-- CreateIndex
CREATE INDEX "AnimeReference_id_value_idx" ON "AnimeReference"("id", "value");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("dcId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("dcId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Welcome" ADD CONSTRAINT "Welcome_guildDcId_fkey" FOREIGN KEY ("guildDcId") REFERENCES "Guild"("dcId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeReference" ADD CONSTRAINT "AnimeReference_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
