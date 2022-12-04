import { Duvua } from "./Client"
import { config } from "./config"
import { logger } from "./modules/logger"
import "@lavaclient/queue/register"

const TOKEN = config.token

if (!TOKEN || TOKEN.length < 10) {
    logger.error("NO VALID TOKEN PROVIDED\nGOT VALUE \"" + TOKEN + "\"")
    process.exit(1)
}

new Duvua(TOKEN)