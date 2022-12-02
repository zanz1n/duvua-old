import { Events } from "discord.js"
import { Duvua } from "../Client"
import { logger } from "../modules/logger"
import { postSlashCommands } from "../modules/postSlashCommands"
import { EventBase } from "../types/eventBase"

export const event: EventBase = {
    name: Events.ClientReady,
    enabled: true,
    async run(client: Duvua) {
        postSlashCommands(client)
        logger.info(`Discord websocket connected | Online in ${(client.guilds.cache).size} guilds`)
    }
}
