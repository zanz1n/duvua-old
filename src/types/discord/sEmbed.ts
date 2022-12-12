import { EmbedBuilder } from "@discordjs/builders"
import { APIEmbed } from "discord.js"
import { config } from "../../config"

export class sEmbed extends EmbedBuilder {
    static utils = {
        defaultMessage(content: string) {
            return new sEmbed({ description: `**${content}**` })
        }
    }
    constructor(data?: APIEmbed | undefined) {
        super(data)
        this.setColor(config.embedColor)
    }
}
