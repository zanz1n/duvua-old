import { Prisma, PrismaClient } from "@prisma/client";
import { Guild as GuildData } from "discord.js";

export class GuildDb {
    private prisma: PrismaClient;
    constructor(client: PrismaClient) { this.prisma = client; }

    public async getFromGuild(guild: GuildData, welcome?: boolean) {
        if (!welcome) welcome = false;
        return await this.prisma.guild.findFirst({
            where: { dcId: guild.id },
            include: { welcome }
        });
    }

    public async updateFromGuild(guild: GuildData, data: Prisma.GuildUpdateInput, welcome?: boolean) {
        if (!welcome) welcome = false;
        return await this.prisma.guild.update({
            where: { dcId: guild.id },
            data,
            include: { welcome }
        });
    }

    public async updateOrCreateGuild(guild: GuildData, data: {
        prefix?: string
        enableTickets?: boolean
        musicStrictM?: boolean
    }, welcome?: boolean) {
        if (!welcome) welcome = false;
        const find = await this.prisma.guild.findFirst({
            where: {
                dcId: guild.id
            }
        });
        if (find) {
            return this.prisma.guild.update({
                where: {
                    dcId: guild.id
                },
                data: {
                    prefix: data.prefix,
                    enableTickets: data.enableTickets,
                    musicStrictM: data.musicStrictM
                },
                include: { welcome }
            });
        }
        return this.prisma.guild.create({
            data: {
                dcId: guild.id,
                prefix: data.prefix,
                enableTickets: data.enableTickets,
                musicStrictM: data.musicStrictM
            },
            include: { welcome }
        });
    }

    public async createFromGuild(guild: GuildData, welcome?: boolean) {
        if (!welcome) welcome = false;
        return await this.prisma.guild.create({
            data: {
                dcId: guild.id
            },
            include: { welcome }
        });
    }

    public async getOrCreateFromGuild(guild: GuildData, welcome?: boolean) {
        if (!welcome) welcome = false;
        const find = await this.getFromGuild(guild, welcome);
        if (find) return find;

        return this.createFromGuild(guild, welcome);
    }
}
