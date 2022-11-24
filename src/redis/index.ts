import Redis from "ioredis"
import { config } from "../config"
import { logger } from "../modules/logger"

const client = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
})

export { client as redisClient }

async function main() {
    client.on("error", (err) => {
        logger.error(`Redis Error: ${err}`)
    })
    logger.info("redis auth : " + await client.auth(config.redis.password))
}

main()
