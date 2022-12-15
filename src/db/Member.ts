import { Prisma, PrismaClient } from "@prisma/client"
import { GuildMember } from "discord.js"


export class MemebrDb {
    private prisma: PrismaClient
    constructor(client: PrismaClient) { this.prisma = client }
    
    public async getFromMember(member: GuildMember) {
        return await this.prisma.member.findFirst({
            where: {
                guildId: member.guild.id,
                AND: { userId: member.user.id }
            }
        }).then((result) => {
            return result
        }).catch(() => {
            return null
        })
    }

    public async updateFromMember(member: GuildMember, data: Prisma.MemberUpdateInput) {
        return await this.prisma.member.update({
            where: { MCID: `${member.guild.id}${member.user.id}` },
            data
        })
    }

    public async createFromMember(member: GuildMember, data?: Prisma.MemberUpdateInput) {
        if (data) {
            return await this.prisma.member.create({
                data: {
                    MCID: `${member.guild.id}${member.user.id}`,
                    guild: {
                        connectOrCreate: {
                            create: {
                                dcId: member.guild.id
                            },
                            where: {
                                dcId: member.guild.id
                            }
                        }
                    },
                    user: {
                        connectOrCreate: {
                            create: {
                                dcId: member.user.id,
                                lastDailyReq: Date.now()
                            },
                            where: {
                                dcId: member.user.id
                            }
                        }
                    }
                }
            }).then(async () => {
                return await this.updateFromMember(member, data)
            })
        }
        return await this.prisma.member.create({
            data: {
                MCID: `${member.guild.id}${member.user.id}`,
                guild: {
                    connectOrCreate: {
                        create: {
                            dcId: member.guild.id
                        },
                        where: {
                            dcId: member.guild.id
                        }
                    }
                },
                user: {
                    connectOrCreate: {
                        create: {
                            dcId: member.user.id,
                            lastDailyReq: Date.now()
                        },
                        where: {
                            dcId: member.user.id
                        }
                    }
                }
            }
        }).then((info) => {
            return info
        })
    }

    public async getOrCreateFromMember(member: GuildMember) {
        const find = await this.getFromMember(member)
        if (find) return find

        return this.createFromMember(member)
    }
}
