import { Prisma, PrismaClient } from "@prisma/client"
import { GuildMember, TextBasedChannel } from "discord.js"

type ticketCreateOptions = {
    channel: TextBasedChannel
    member: GuildMember
}

export class TicketDb {
    private prisma: PrismaClient
    constructor(client: PrismaClient) { this.prisma = client }

    public async getFromMember(member: GuildMember) {
        return await this.prisma.ticket.findFirst({
            where: {
                memberId: `${member.guild.id}${member.user.id}`
            }
        }).then((result) => {
            return result
        }).catch(() => {
            return null
        })
    }

    public async updateFromMember(member: GuildMember, data: Prisma.TicketUpdateInput) {
        return await this.prisma.ticket.update({
            where: {
                memberId: `${member.guild.id}${member.user.id}`
            },
            data
        }).then((result) => {
            return result
        }).catch(() => {
            return null
        })
    }

    public async createFromOptions(options: ticketCreateOptions, data?: Prisma.TicketUpdateInput) {
        if (data) {
            return await this.prisma.ticket.create({
                data: {
                    channelId: options.channel.id,
                    member: {
                        connectOrCreate: {
                            create: {
                                MCID: `${options.member.guild.id}${options.member.user.id}`,
                                guild: {
                                    connectOrCreate: {
                                        create: {
                                            dcId: options.member.guild.id
                                        },
                                        where: {
                                            dcId: options.member.guild.id
                                        }
                                    }
                                },
                                user: {
                                    connectOrCreate: {
                                        create: {
                                            dcId: options.member.user.id,
                                            lastDailyReq: Date.now()
                                        },
                                        where: {
                                            dcId: options.member.user.id
                                        }
                                    }
                                }
                            },
                            where: {
                                MCID: `${options.member.guild.id}${options.member.user.id}`
                            }
                        }
                    },
                    enabled: false
                }
            }).then(async () => {
                return await this.updateFromMember(options.member, data)
            })
        }
        return await this.prisma.ticket.create({
            data: {
                channelId: options.channel.id,
                member: {
                    connectOrCreate: {
                        create: {
                            MCID: `${options.member.guild.id}${options.member.user.id}`,
                            guild: {
                                connectOrCreate: {
                                    create: {
                                        dcId: options.member.guild.id
                                    },
                                    where: {
                                        dcId: options.member.guild.id
                                    }
                                }
                            },
                            user: {
                                connectOrCreate: {
                                    create: {
                                        dcId: options.member.user.id,
                                        lastDailyReq: Date.now()
                                    },
                                    where: {
                                        dcId: options.member.user.id
                                    }
                                }
                            }
                        },
                        where: {
                            MCID: `${options.member.guild.id}${options.member.user.id}`
                        }
                    }
                },
                enabled: false
            }
        }).then((result) => {
            return result
        })
    }

    public async getOrCreateFromOptions(options: ticketCreateOptions) {
        const find = await this.getFromMember(options.member)
        if (find) return find

        return this.createFromOptions(options)
    }

    public async deleteFromMember(member: GuildMember) {
        return await this.prisma.ticket.delete({
            where: {
                memberId: `${member.guild.id}${member.user.id}`
            }
        }).then((result) => {
            return result
        }).catch(() => {
            return null
        })
    }
}
