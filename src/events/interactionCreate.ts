import { GuildMember } from "discord.js"
import { Duvua } from "../Client"
import { eventBase } from "../types/eventBase"
import { sInteraction } from "../types/sInteraction"

export const event: eventBase = {
    name: "interactionCreate",
    enabled: true,
    async run(interaction: sInteraction, client: Duvua) {

        if (!(interaction.member instanceof GuildMember)) return

        const cmd = client.commands.find(c => c.data.name == interaction.commandName)
        if (!cmd) return

        if (cmd.needsDefer) await interaction.deferReply({ ephemeral: cmd.ephemeral })

        cmd.run(interaction, client)
    }
}
