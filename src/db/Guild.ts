import { Prisma, PrismaClient } from "@prisma/client"
import { Guild as GuildData } from "discord.js"

export class GuildDb {
    private prisma: PrismaClient
    constructor(client: PrismaClient) { this.prisma = client }

    public async getFromGuild(guild: GuildData) {
        return await this.prisma.guild.findFirst({
            where: { dcId: guild.id }
        }).then((data) => {
            return data
        }).catch(() => {
            return null
        })
    }

    public async updateFromGuild(guild: GuildData, data: Prisma.GuildUpdateInput) {
        return await this.prisma.guild.update({
            where: { dcId: guild.id },
            data
        }).then((result) => {
            return result
        }).catch(() => {
            return null
        })
    }

    public async createFromGuild(guild: GuildData, data?: Prisma.GuildUpdateInput) {
        if (data) {
            return await this.prisma.guild.create({
                data: {
                    dcId: guild.id,
                }
            }).then(async (data) => {
                await this.updateFromGuild(guild, data)
                return data
            })
        }
        return await this.prisma.guild.create({
            data: {
                dcId: guild.id,
                welcome: {
                    connectOrCreate: {
                        create: {
                            channelId: null,
                            enabled: false
                        },
                        where: {
                            guildId: guild.id
                        }
                    }
                }
            }
        }).then((result) => {
            return result
        })
    }

    public async getOrCreateFromGuild(guild: GuildData) {
        const find = await this.getFromGuild(guild)
        if (find) return find

        return this.createFromGuild(guild)
    }
}
