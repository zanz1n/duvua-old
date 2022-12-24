import { ApplicationCommandOptionType, GuildMember, PermissionFlagsBits } from "discord.js"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { createMentionByUser as men } from "../../modules/createMentionByUser"

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
            },
            {
                type: ApplicationCommandOptionType.SubcommandGroup,
                name: "strict",
                description: "Comandos relacionados ao modo estrito de música",
                descriptionLocalizations: { "en-US": "Strict music mode related commands" },
                options: [
                    {
                        type: ApplicationCommandOptionType.Subcommand,
                        name: "toggle",
                        description: "Habilita ou desabilita o modo estrito de música no servidor",
                        descriptionLocalizations: { "en-US": "Toggle the strict music mode" },
                        options: [
                            {
                                type: ApplicationCommandOptionType.Boolean,
                                name: "enabled",
                                description: "O modo estrito deve ser habilitado?",
                                descriptionLocalizations: { "en-US": "Should the strict mode be enabled?"},
                                required: true
                            }
                        ]
                    },
                    {
                        type: ApplicationCommandOptionType.Subcommand,
                        name: "add",
                        description: "Adiciona um usuário a lista de permitidos para tocar",
                        descriptionLocalizations: { "en-US": "Adds a user to the list of allowed to play" },
                        options: [
                            {
                                type: ApplicationCommandOptionType.User,
                                name: "user",
                                description: "O usuário que deve ser adicionado",
                                descriptionLocalizations: { "en-US": "The user who should be added"},
                                required: true
                            }
                        ]
                    },
                    {
                        type: ApplicationCommandOptionType.Subcommand,
                        name: "remove",
                        description: "Remove um usuário da lista de permitidos para tocar",
                        descriptionLocalizations: { "en-US": "Removes a user of the list of allowed to play" },
                        options: [
                            {
                                type: ApplicationCommandOptionType.User,
                                name: "user",
                                description: "O usuário que deve ser removido",
                                descriptionLocalizations: { "en-US": "The user who should be removed"},
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
            if (!member || !(member instanceof GuildMember)) return
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
        else if (subcommandGroup == "strict") {
            if (subCommand == "toggle") {
                const enabled = interaction.options.getBoolean("enabled", true)
                const guildDb = await client.dba.guild.updateOrCreateGuild(interaction.guild, {
                    musicStrictM: enabled
                })
                client.utils.createDefaultReply(interaction,
                    `O modo estrito de música foi ${guildDb.musicStrictM ? "habilitado" : "desabilitado"}, {USER}`)
                return
            }
            const member = interaction.options.getMember("user")
            if (!member || !(member instanceof GuildMember)) return
            if (subCommand == "add") {
                client.dba.member.updateOrCreateMember(member, { playAllowed: true })
                client.utils.createDefaultReply(interaction, `${men(member.user)} agora pode tocar músicas no servidor`)
            }
            else if (subCommand == "remove") {
                client.dba.member.updateOrCreateMember(member, { playAllowed: false })
                client.utils.createDefaultReply(interaction, `${men(member.user)} agora não pode mais tocar músicas no servidor`)
            }
        }
    }
}
