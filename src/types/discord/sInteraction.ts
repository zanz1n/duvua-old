import { ChatInputCommandInteraction } from "discord.js"

export interface sInteraction extends ChatInputCommandInteraction { defered: true }
