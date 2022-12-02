import { ApplicationCommandData, Collection } from "discord.js"
import { readdirSync } from "fs"
import { join } from "path"
import { CommandBase } from "../types/commandBase"
import { logger } from "./logger"

export function loadCommands() {
    logger.info("Loading commands in /commands")
    const slashCommands: Collection<string, CommandBase> = new Collection()
    const path = join(__dirname, "..", "commands")
    const groups = readdirSync(path)
    for (const group of groups) {
        const commands = readdirSync(`${path}/${group}`)
            .filter(file => file.endsWith(".ts") || file.endsWith(".js"))
        for (const command of commands) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const cmd = require(`${path}/${group}/${command}`)
            if (cmd && cmd.command && cmd.command.enabled) slashCommands.set(cmd.command.data.name, cmd.command)
        }
    }
    return slashCommands
}

export const commands = loadCommands()

function loadCommandsData() {
    logger.info("Generating commands raw data")
    const slashCommands: Collection<string, ApplicationCommandData> = new Collection()
    commands.forEach(command => {
        slashCommands.set(command.data.name, command.data)
    })
    return slashCommands
}

export const commandsData = loadCommandsData()
