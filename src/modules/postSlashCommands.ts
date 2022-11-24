import { REST, Routes } from "discord.js"
import { Duvua } from "../Client"
import { commandsData } from "./loadCommandsData"
import { logger } from "./logger"
import { config } from "../config"

export async function postSlashCommands(client: Duvua) {
    logger.info("Starting slash commands registration")

    const rest = new REST({ version: "10" }).setToken(config.token)

    if (client.application?.id) {
        try {
            await rest.put(
                Routes.applicationCommands(client.application.id), {
                    body: commandsData
                }).then(() => {
                logger.info(`${commandsData.length} commands sucessfully registered`)
            })
        } catch (e) {
            logger.error(`Failed to register commands: ${e}`)
        }
    }
}
