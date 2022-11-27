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
    "silverCoins" BIGINT NOT NULL DEFAULT 0,
    "XP" BIGINT NOT NULL DEFAULT 0,
    "level" BIGINT NOT NULL DEFAULT 0,
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
    "lastDailyReq" BIGINT NOT NULL,
    "job" "MemberJob" NOT NULL DEFAULT 'MENDIGO',
    "goldCoins" BIGINT NOT NULL DEFAULT 0,

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
    "message" VARCHAR(255) NOT NULL DEFAULT 'Seja Bem Vind@ ao servidor',
    "type" "WCType" NOT NULL DEFAULT 'MESSAGE',
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Welcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Ticket_memberId_key" ON "Ticket"("memberId");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("dcId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("dcId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Welcome" ADD CONSTRAINT "Welcome_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("dcId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("MCID") ON DELETE RESTRICT ON UPDATE CASCADE;
