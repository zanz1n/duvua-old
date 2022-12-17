import { PrismaClient } from "@prisma/client"
import { GuildDb } from "./Guild"
import { MemebrDb } from "./Member"
import { UserDb } from "./User"

export class Dba {
    private prisma: PrismaClient

    public guild: GuildDb
    public member: MemebrDb
    public user: UserDb
    
    constructor(client: PrismaClient) {
        this.prisma = client
        this.guild = new GuildDb(this.prisma)
        this.member = new MemebrDb(this.prisma)
        this.user = new UserDb(this.prisma)
    }
}
