import Redis from "ioredis"
import { config } from "../config"
import { logger } from "../modules/logger"

export class RedisClient extends Redis {
    constructor() {
        super({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password
        })
        this.on("error", (err) => {
            logger.error(`Redis Error: ${err}`)
        })
        logger.info("Redis connection : " + this.auth(config.redis.password))
    }
}
