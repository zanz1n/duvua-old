import { Redis } from "ioredis";
import { Service } from "../lib/decorators/Service.js";
import { Logger } from "../lib/Logger.js";

@Service()
export class CacheService extends Redis {
    constructor() {
        new Logger("CacheService").info("CacheService initialized");
        super({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD
        });
    }
}
