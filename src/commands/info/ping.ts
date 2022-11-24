import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"


export const command: CommandBase = {
    data: {
        name: "ping",
        description: "Mostra o ping do bot e responde com pong",
    },
    enabled: true,
    ephemeral: true,
    needsDefer: false,
    category: CommandBaseCategory.INFO,
    
    async run({interaction, client}) {
        const embed = new sEmbed()
            .setDescription(`**Pong!**\nPing do bot: ${client.ws.ping}`)

        await interaction.reply({
            fetchReply: true,
            ephemeral: true,
            content: undefined,
            embeds: [embed]
        })
    }
}
