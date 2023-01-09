import { ChatInputApplicationCommandData } from "discord.js"
import { Duvua } from "../Client"
import { sInteraction } from "./discord/sInteraction"
// import type { Class } from "type-fest"

export enum CommandBaseCategory {
    FUN = "FUN",
    INFO = "INFO",
    MODUTIL = "MODUTIL",
    MUSIC = "MUSIC",
    MONEYLEVEL = "MONEYLEVEL"
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

// export type CommandBaseData = {
//     ephemeral: boolean
//     enabled: boolean
//     data: ChatInputApplicationCommandData
//     needsDefer: boolean
//     category: CommandBaseCategory
// }

// export function command(data: CommandBaseData) {
//     return (target: Class<Command>) => {
//         return class extends target {
//             constructor(...args: any[]) {
//                 super(data, ...args)
//             }
//         }
//     }
// }

// export class Command {
//     readonly data: ChatInputApplicationCommandData
//     readonly ephemeral: boolean
//     readonly enabled: boolean
//     readonly needsDefer: boolean
//     readonly category: CommandBaseCategory

//     constructor(opts: CommandBaseData) {
//         this.data = opts.data
//         this.ephemeral = opts.ephemeral
//         this.enabled = opts.enabled
//         this.needsDefer = opts.needsDefer
//         this.category = opts.category
//     }
// }
