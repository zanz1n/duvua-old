import { InteractionEditReplyOptions } from "discord.js"
import { sEmbed } from "../types/discord/sEmbed"
import { sInteraction } from "../types/discord/sInteraction"
import { createMentionByUser } from "./createMentionByUser"

export class ClientUtils {
    createDefaultReply(interaction: sInteraction, text: string, options?: InteractionEditReplyOptions) {
        return interaction.editReply({
            ...options,
            embeds: [sEmbed.utils.defaultMessage(text.replace("{USER}", createMentionByUser(interaction.user)))]
        })
    }
}
