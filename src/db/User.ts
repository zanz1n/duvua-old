import { Prisma, PrismaClient } from "@prisma/client"

import { User as UserData } from "discord.js"

export class UserDb {
    private prisma: PrismaClient
    constructor(client: PrismaClient) { this.prisma = client }
    
    public async getFromUser(user: UserData) {
        return await this.prisma.user.findFirst({
            where: {
                dcId: user.id
            }
        })
    }

    public async updateFromUser(user: UserData, data: Prisma.UserUpdateInput) {
        return await this.prisma.user.update({
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
            return await this.prisma.user.create({
                data: {
                    dcId: user.id,
                    lastDailyReq: Date.now().toString()
                }
            }).then(async () => {
                return await this.updateFromUser(user, data)
            }).catch(() => {
                return null
            })
        }
        return await this.prisma.user.create({
            data: {
                dcId: user.id,
                lastDailyReq: Date.now().toString()
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
