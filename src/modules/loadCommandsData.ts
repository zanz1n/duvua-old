import { ApplicationCommandData } from "discord.js"
import { readdirSync } from "fs"
import { join } from "path"
import { CommandBase } from "../types/commandBase"
import { logger } from "./logger"

export function loadCommands() {
    logger.info("Loading commands in /commands")
    const slashCommands: CommandBase[] = []
    const path = join(__dirname, "..", "commands")
    const groups = readdirSync(path)
    for (const group of groups) {
        const commands = readdirSync(`${path}/${group}`)
            .filter(file => file.endsWith(".ts") || file.endsWith(".js"))
        for (const command of commands) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const cmd = require(`${path}/${group}/${command}`)
            if (cmd && cmd.command && cmd.command.enabled) slashCommands.push(cmd.command)
        }
    }
    return slashCommands
}

export const commands = loadCommands()

function loadCommandsData() {
    logger.info("Generating commands raw data")
    const slashCommands: ApplicationCommandData[] = []
    for (const command of commands) {
        slashCommands.push(command.data)
    }
    return slashCommands
}

export const commandsData = loadCommandsData()
