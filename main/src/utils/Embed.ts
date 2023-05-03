import { APIEmbed, EmbedBuilder, EmbedData, InteractionEditReplyOptions } from "discord.js";
import { CommandBaseInteraction } from "lib/types/CommandBase.js";
import { men } from "./mention.js";

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

export function createDefaultReply(interaction: CommandBaseInteraction<true>, text: string, options?: InteractionEditReplyOptions) {
    return interaction.editReply({
        ...options,
        embeds: [embed(text.replace("{USER}", men(interaction.user)))]
    });
}
