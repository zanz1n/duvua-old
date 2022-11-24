import { ApplicationCommandOptionType } from "discord.js"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"

export const command: CommandBase = {
    data: {
        name: "kiss",
        description: "Demonstre todo o seu amor a uma pessoa benjando-a",
        options: [
            {
                name: "usuario",
                description: "Quem deseja beijar",
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ]
    },
    enabled: false,
    ephemeral: false,
    category: CommandBaseCategory.FUN,
    needsDefer: true,
    async run(interaction, client) {
        return
    },
}
