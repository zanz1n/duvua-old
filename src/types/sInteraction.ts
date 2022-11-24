import { CacheType, ChatInputCommandInteraction } from "discord.js";

export interface sInteraction extends ChatInputCommandInteraction<CacheType> {
    defered: true
}
