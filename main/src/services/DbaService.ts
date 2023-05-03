import { Service } from "../lib/decorators/Service.js";
import { PrismaService } from "./PrismaService.js";
import { GuildDb } from "./dba/Guild.js";
import { MemebrDb } from "./dba/Member.js";
import { UserDb } from "./dba/User.js";

@Service()
export class DbaService {
    public guild: GuildDb;
    public member: MemebrDb;
    public user: UserDb;
    
    constructor(private readonly prisma: PrismaService) {
        this.guild = new GuildDb(this.prisma);
        this.member = new MemebrDb(this.prisma);
        this.user = new UserDb(this.prisma);
    }
}
