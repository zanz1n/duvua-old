import { APIEmbed, EmbedBuilder, EmbedData } from "discord.js";

export default class Embed extends EmbedBuilder {
    constructor(data?: EmbedData | APIEmbed) {
        super(data);
        this.setColor(0xffffff);
    }
}

export function embed(description?: string) {
    const embed = new Embed();

    if (description) {
        embed.setDescription(`**${description}**`);
    }

    return embed;
}
