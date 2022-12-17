import { Prisma, PrismaClient } from "@prisma/client"
import { Guild as GuildData } from "discord.js"

export class GuildDb {
    private prisma: PrismaClient
    constructor(client: PrismaClient) { this.prisma = client }

    public async getFromGuild(guild: GuildData, welcome: boolean) {
        return await this.prisma.guild.findFirst({
            where: { dcId: guild.id },
            include: { welcome }
        })
    }

    public async updateFromGuild(guild: GuildData, data: Prisma.GuildUpdateInput, welcome: boolean) {
        return await this.prisma.guild.update({
            where: { dcId: guild.id },
            data,
            include: { welcome }
        }).then((result) => {
            return result
        }).catch(() => {
            return null
        })
    }

    public async createFromGuild(guild: GuildData, welcome: boolean, data?: Prisma.GuildUpdateInput) {
        if (data) {
            return await this.prisma.guild.create({
                data: {
                    dcId: guild.id
                },
                include: { welcome }
            }).then(async (result) => {
                await this.updateFromGuild(guild, data, welcome)
                return result
            })
        }
        return await this.prisma.guild.create({
            data: {
                dcId: guild.id
            },
            include: { welcome }
        }).then((result) => {
            return result
        })
    }

    public async getOrCreateFromGuild(guild: GuildData, welcome: boolean) {
        const find = await this.getFromGuild(guild, welcome)
        if (find) return find

        return this.createFromGuild(guild, welcome)
    }
}
