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
    "MCID" VARCHAR(48) NOT NULL,
    "silverCoins" INTEGER NOT NULL DEFAULT 0,
    "XP" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,
    "dj" BOOLEAN NOT NULL DEFAULT false,
    "playAllowed" BOOLEAN NOT NULL DEFAULT false,
    "guildId" VARCHAR(24) NOT NULL,
    "userId" VARCHAR(24) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dcId" VARCHAR(24) NOT NULL,
    "lastDailyReq" INTEGER NOT NULL,
    "job" "MemberJob" NOT NULL DEFAULT 'MENDIGO',
    "goldCoins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dcId" VARCHAR(24) NOT NULL,
    "prefix" VARCHAR(4) NOT NULL DEFAULT '-',
    "enableTickets" BOOLEAN NOT NULL DEFAULT true,
    "musicStrictM" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Welcome" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "channelId" VARCHAR(24),
    "message" VARCHAR(255) NOT NULL DEFAULT 'Seja Bem Vind@ ao servidor USER',
    "type" "WCType" NOT NULL DEFAULT 'MESSAGE',
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Welcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "channelId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "User_dcId_key" ON "User"("dcId");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_dcId_key" ON "Guild"("dcId");

-- CreateIndex
CREATE UNIQUE INDEX "Welcome_guildId_key" ON "Welcome"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_channelId_key" ON "Ticket"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_memberId_key" ON "Ticket"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Anime_kitsuId_key" ON "Anime"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeReference_value_key" ON "AnimeReference"("value");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("dcId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("dcId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Welcome" ADD CONSTRAINT "Welcome_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("dcId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("MCID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeReference" ADD CONSTRAINT "AnimeReference_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
