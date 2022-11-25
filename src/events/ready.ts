import { Duvua } from "../Client"
import { logger } from "../modules/logger"
import { postSlashCommands } from "../modules/postSlashCommands"
import { eventBase } from "../types/eventBase"

export const event: eventBase = {
    name: "ready",
    enabled: true,
    async run(client: Duvua) {
        postSlashCommands(client)
        logger.info(`Discord websocket connected | Online in ${(await client.guilds.fetch()).size} guilds`)
    }
}
