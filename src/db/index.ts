import {
    Prisma,
    PrismaClient
} from "@prisma/client"
import {
    Guild as GuildData,
    GuildMember,
    TextBasedChannel,
    User as UserData
} from "discord.js"
import { logger } from "../modules/logger"

const prisma = new PrismaClient()

type ticketCreateOptions = {
    channel: TextBasedChannel
    member: GuildMember
}

class GuildDb {
    public async getFromGuild(guild: GuildData) {
        return await prisma.guild.findFirst({
            where: { dcId: guild.id }
        }).then((data) => {
            return data
        }).catch(() => {
            return null
        })
    }

    public async updateFromGuild(guild: GuildData, data: Prisma.GuildUpdateInput) {
        return await prisma.guild.update({
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
            return await prisma.guild.create({
                data: {
                    dcId: guild.id,
                }
            }).then(async (data) => {
                await this.updateFromGuild(guild, data)
                return data
            })
        }
        return await prisma.guild.create({
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

class MemebrDb {
    public async getFromMember(member: GuildMember) {
        return await prisma.member.findFirst({
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
        return await prisma.member.update({
            where: { MCID: `${member.guild.id}${member.user.id}` },
            data
        })
    }

    public async createFromMember(member: GuildMember, data?: Prisma.MemberUpdateInput) {
        if (data) {
            return await prisma.member.create({
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
        return await prisma.member.create({
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

class UserDb {
    public async getFromUser(user: UserData) {
        return await prisma.user.findFirst({
            where: {
                dcId: user.id
            }
        }).then((result) => {
            return result
        }).catch(() => {
            return null
        })
    }

    public async updateFromUser(user: UserData, data: Prisma.UserUpdateInput) {
        return await prisma.user.update({
            where: { dcId: user.id },
            data
        }).then((result) => {
            return result
        }).catch(() => {
            return null
        })
    }

    public async createFromUser(user: UserData, data?: Prisma.UserUpdateInput) {
        if (data) {
            return await prisma.user.create({
                data: {
                    dcId: user.id,
                    lastDailyReq: Date.now()
                }
            }).then(async () => {
                return await this.updateFromUser(user, data)
            }).catch(() => {
                return null
            })
        }
        return await prisma.user.create({
            data: {
                dcId: user.id,
                lastDailyReq: Date.now()
            }
        }).then((result) => {
            return result
        })
    }

    public async getOrCreateFromUser(user: UserData) {
        const find = await this.getFromUser(user)
        if (find) return find

        return this.createFromUser(user)
    }
}

class TicketDb {
    public async getFromMember(member: GuildMember) {
        return await prisma.ticket.findFirst({
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
        return await prisma.ticket.update({
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
            return await prisma.ticket.create({
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
        return await prisma.ticket.create({
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
        return await prisma.ticket.delete({
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

export class Dba {
    public guild = new GuildDb
    public member = new MemebrDb
    public user = new UserDb
    public ticket = new TicketDb
}

async function main() {
    await prisma.guild.findMany()
}

main()
    .then(async () => {
        logger.info("Postgres connection : OK")
    })
    .catch(async (e) => {
        logger.error("Prisma error: " + e)
        await prisma.$disconnect()
        process.exit(1)
    })
