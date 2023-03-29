import { PrismaClient } from "@prisma/client";
import { Logger } from "../lib/Logger.js";
import { Service } from "../lib/decorators/Service.js";

@Service()
export class PrismaService extends PrismaClient {
    constructor() {
        new Logger("PrismaService").info("PrismaService initialized");
        super();
        this.$on("beforeExit", () => this.$disconnect());
    }
}
