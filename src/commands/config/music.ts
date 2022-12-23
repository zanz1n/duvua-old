import { ApplicationCommandOptionType, GuildMember, PermissionFlagsBits } from "discord.js"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"

export const command: CommandBase = {
    category: CommandBaseCategory.MODUTIL,
    enabled: true,
    ephemeral: false,
    needsDefer: true,
    data: {
        name: "music",
        description: "Configurações relacionadas a funcionalidade de música do bot",
        descriptionLocalizations: { "en-US": "Bot music functionality related configurations" },
        options: [
            {
                type: ApplicationCommandOptionType.SubcommandGroup,
                name: "dj",
                description: "Faz de um usuário um dj. Ele poderá controlar a playlist (comandos stop e skip)",
                descriptionLocalizations: { "en-US": "Make a user a dj. He will be able to control the playlist (stop and skip commands)" },
                options: [
                    {
                        type: ApplicationCommandOptionType.Subcommand,
                        name: "add",
                        description: "Faz de um usuário um dj. Ele poderá controlar a playlist (comandos stop e skip)",
                        descriptionLocalizations: { "en-US": "Make a user a dj. He will be able to control the playlist (stop and skip commands)" },
                        options: [
                            {
                                type: ApplicationCommandOptionType.User,
                                name: "user",
                                // nameLocalizations: { "pt-BR": "usuário" },
                                description: "O usuário que você deseja tornar dj",
                                descriptionLocalizations: { "en-US": "The user that you want to make dj" },
                                required: true
                            }
                        ]
                    },
                    {
                        type: ApplicationCommandOptionType.Subcommand,
                        name: "remove",
                        description: "Remove um usuário do cargo de dj. Ele não poderá mais controlar a playlist",
                        descriptionLocalizations: { "en-US": "Remove a user from dj list. He will no longer be able to control the playlist" },
                        options: [
                            {
                                type: ApplicationCommandOptionType.User,
                                name: "user",
                                // nameLocalizations: { "pt-BR": "usuário" },
                                description: "O usuário que você deseja remover do cargo de dj",
                                descriptionLocalizations: { "en-US": "The user that you want to unmake dj" },
                                required: true
                            }
                        ]
                    }
                ]
            }
        ]
    },

    async run({interaction, client}) {
        if (!interaction.member || !(interaction.member instanceof GuildMember)) return
        if (!interaction.guild) return

        const subcommandGroup = interaction.options.getSubcommandGroup()
        const subCommand = interaction.options.getSubcommand()

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            client.utils.createDefaultReply(interaction, "Você não tem permissão para usar esse comando, {USER}")
            return
        }

        if (subcommandGroup == "dj") {
            const member = interaction.options.getMember("user")
            if (!member || !(member instanceof GuildMember)) throw new Error("!member || !(member instanceof GuildMember)")
            if (subCommand == "add") {
                const memberDb = await client.dba.member.updateOrCreateMember(member, { dj: true })
                client.utils.createDefaultReply(interaction, `<@${memberDb.userId}> é um dj`)
                return
            }
            else if (subCommand == "remove") {
                const memberDb = await client.dba.member.updateOrCreateMember(member, { dj: false })
                client.utils.createDefaultReply(interaction, `<@${memberDb.userId}> não é mais um dj`)
                return
            }
        }
    }
}