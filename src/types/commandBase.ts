import { ChatInputApplicationCommandData } from "discord.js"
import { Duvua } from "../Client"
import { sInteraction } from "./discord/sInteraction"

export enum CommandBaseCategory {
    FUN,
    INFO
}

export type CommandBaseRunArg = {
    interaction: sInteraction
    client: Duvua
}

export type CommandBase = {
    ephemeral: boolean
    enabled: boolean
    data: ChatInputApplicationCommandData
    needsDefer: boolean
    category: CommandBaseCategory
    run: (args: CommandBaseRunArg) => Promise<any>
}