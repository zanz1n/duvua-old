import { REST, Routes } from "discord.js"
import { Duvua } from "../Client"
import { commandsData as commandsDataRaw } from "./loadCommandsData"
import { logger } from "./logger"
import { config } from "../config"
import { additionalCommands } from "../utils/additionalCommands"

export async function postSlashCommands(client: Duvua) {
    logger.info("Starting slash commands registration")

    const rest = new REST({ version: "10" }).setToken(config.token)

    const data = commandsDataRaw

    additionalCommands.forEach(acmd => data.set(acmd.name, acmd))

    if (client.application?.id) {
        try {
            await rest.put(
                Routes.applicationCommands(client.application.id), {
                    body: data
                }).then(() => {
                logger.info(`${data.size} commands sucessfully registered`)
            })
        } catch (e) {
            logger.error(`Failed to register commands: ${e}`)
        }
    }
}
