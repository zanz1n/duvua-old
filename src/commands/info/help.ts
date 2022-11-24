import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"

export const command: CommandBase = {
    data: {
        name: "help",
        description: "Mostra todos os comandos do bot e suas funções"
    },
    enabled: true,
    ephemeral: false,
    needsDefer: true,
    category: CommandBaseCategory.INFO,

    async run(interaction, client) {
        const find = await client.redis.get("help-embed-data")
        if (find) {
            interaction.editReply({
                content: null,
                embeds: [JSON.parse(find)]
            })
            return
        }
        const helpEmbed = new sEmbed()
            .setTitle("Help")
        for (const command of client.commands) {
            helpEmbed.addFields({
                name: command.data.name,
                value: command.data.description,
                inline: true
            })
        }
        interaction.editReply({
            content: null,
            embeds: [helpEmbed]
        })

        client.redis.set("help-embed-data", JSON.stringify(helpEmbed))
    }
}
