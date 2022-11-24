import { ChatInputApplicationCommandData } from "discord.js"
import { Duvua } from "../Client"
import { sInteraction } from "./sInteraction"

export enum CommandBaseCategory {
    FUN,
    INFO
}

export type CommandBase = {
    ephemeral: boolean
    enabled: boolean
    data: ChatInputApplicationCommandData
    needsDefer: boolean
    category: CommandBaseCategory
    run: (interaction: sInteraction, client: Duvua) => Promise<any>
}