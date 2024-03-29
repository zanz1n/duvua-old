import { Prisma, PrismaClient } from "@prisma/client";
import { GuildMember } from "discord.js";

export class MemebrDb {
    private prisma: PrismaClient;
    constructor(client: PrismaClient) { this.prisma = client; }
    
    public async getFromMember(member: GuildMember) {
        return await this.prisma.member.findFirst({
            where: {
                guildId: member.guild.id,
                AND: { userId: member.user.id }
            }
        });
    }

    public async updateFromMember(member: GuildMember, data: Prisma.MemberUpdateInput) {
        return this.prisma.member.update({
            where: { MCID: `${member.guild.id}${member.user.id}` },
            data
        });
    }

    public async updateOrCreateMember(member: GuildMember, data: {
        silverCoins?: number
        XP?: number
        level?: number
        dj?: boolean
        playAllowed?: boolean}
    ) {
        const find = await this.getFromMember(member);
        if (find) {
            return this.prisma.member.update({
                where: { MCID: `${member.guild.id}${member.user.id}` },
                data: {
                    silverCoins: data.silverCoins,
                    XP: data.XP,
                    level: data.level,
                    dj: data.dj,
                    playAllowed: data.playAllowed
                }
            });
        }
        return this.prisma.member.create({
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
                            lastDailyReq: Date.now().toString()
                        },
                        where: {
                            dcId: member.user.id
                        }
                    }
                },
                silverCoins: data.silverCoins,
                XP: data.XP,
                level: data.level,
                dj: data.dj,
                playAllowed: data.playAllowed,
            }
        });
    }

    public async createFromMember(member: GuildMember) {
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
                            lastDailyReq: Date.now().toString()
                        },
                        where: {
                            dcId: member.user.id
                        }
                    }
                }
            }
        }).then((info) => {
            return info;
        });
    }

    public async getOrCreateFromMember(member: GuildMember) {
        const find = await this.getFromMember(member);
        if (find) return find;

        return this.createFromMember(member);
    }
}
