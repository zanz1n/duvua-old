import { ApplicationCommandOptionType, ChannelType, GuildMember, PermissionFlagsBits } from "discord.js"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { Duvua } from "../../Client"
import { Welcome } from "@prisma/client"

async function refreshCache(client: Duvua, data: Welcome) {
    client.redis.set(`welcome-${data.guildDcId}`, JSON.stringify(data), "EX", 120)
}

export const command: CommandBase = {
    category: CommandBaseCategory.MODUTIL,
    enabled: true,
    ephemeral: false,
    needsDefer: true,
    data: {
        name: "config",
        description: "Comandos de configuração do bot",
        descriptionLocalizations: { "en-US": "Bot configuration commands" },
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "welcome",
                description: "Altera a mensagem de boas vindas do servidor",
                descriptionLocalizations: { "en-US": "Change the welcome server message" },
                options: [
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "channel",
                        description: "O canal que você deseja usar para as mensagens",
                        descriptionLocalizations: { "en-US": "The channel that you want to use to send the messages" },
                        required: true
                    },
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "message",
                        description: "A mensagem de boas vindas que será exibida",
                        descriptionLocalizations: { "en-US": "The welcome message that will be show" },
                        required: true
                    },
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "type",
                        description: "O tipo de mensagem de boas vindas",
                        descriptionLocalizations: { "en-US": "The welcome message type" },
                        required: true,
                        choices: [
                            {
                                name: "Mensagem",
                                value: "MESSAGE"
                            },
                            {
                                name: "Embed",
                                value: "EMBED"
                            },
                            {
                                name: "Imagem",
                                value: "IMAGE"
                            }
                        ]
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "enablewelcome",
                description: "Habilita ou desabilita a funcionalidade de mensagem de boas vindas",
                descriptionLocalizations: { "en-US": "Toggle the welcome message functionality in the server" },
                options: [
                    {
                        type: ApplicationCommandOptionType.Boolean,
                        name: "enabled",
                        description: "A mensagem de boas vindas deve ser hablilitada?",
                        descriptionLocalizations: { "en-US": "Should the welcome message be enabled?" },
                        required: true
                    }
                ]
            }
        ]
    },

    async run({interaction, client}) {
        if (!interaction.member || !(interaction.member instanceof GuildMember)) return
        if (!interaction.guild) return

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            client.utils.createDefaultReply(interaction, "Você não tem permissão para usar esse comando, {USER}")
            return
        }
        const subCommand = interaction.options.getSubcommand()

        if (subCommand == "welcome") {
            const channel = interaction.options.getChannel("channel", true)

            if (channel.type != ChannelType.GuildText) {
                client.utils.createDefaultReply(interaction, "Você precisa selecionar um canal de texto válido, {USER}")
                return
            }

            const message = interaction.options.getString("message", true)

            if (message.length > 250) {
                client.utils.createDefaultReply(interaction, "O tamanho máximo da mensagem é de 250 caratéres")
                return
            }

            const contentType = interaction.options.getString("type", true) as "MESSAGE" | "EMBED" | "IMAGE"

            let replyMessage = ""

            const findWelcomeDb = await client.prisma.welcome.findFirst({
                where: {
                    guildDcId: interaction.guild.id
                }
            })

            if (findWelcomeDb) {
                await client.prisma.welcome.update({
                    where: {
                        guildDcId: interaction.guild.id
                    },
                    data: {
                        message,
                        channelId: channel.id,
                        type: contentType,
                        enabled: true
                    }
                }).then((result) => {
                    refreshCache(client, result)
                    replyMessage = `Mensagem de boas vindas do tipo ${contentType} atualizada. Usando o canal <#${result.channelId}>`
                })
            } else {
                await client.prisma.welcome.create({
                    data: {
                        message,
                        channelId: channel.id,
                        type: contentType,
                        enabled: true,
                        guild: {
                            connectOrCreate: {
                                create: {
                                    dcId: interaction.guild!.id,
                                },
                                where: {
                                    dcId: interaction.guild!.id,
                                }
                            }
                        }
                    }
                }).then((result) => {
                    refreshCache(client, result)
                    replyMessage = `Mensagem de boas vindas do tipo ${contentType} criada. Usando o canal <#${result.channelId}>`
                })
            }

            client.utils.createDefaultReply(interaction, replyMessage)
            return
        }
        else if (subCommand == "enablewelcome") {
            const enabled = interaction.options.getBoolean("enabled", true)

            let replyMessage = ""

            const findWelcomeDb = await client.prisma.welcome.findFirst({
                where: {
                    guildDcId: interaction.guild.id
                }
            })

            if (findWelcomeDb) {
                await client.prisma.welcome.update({
                    where: {
                        guildDcId: interaction.guild.id
                    },
                    data: {
                        enabled
                    }
                }).then((result) => {
                    refreshCache(client, result)
                    replyMessage = "A mensagem de boas vindas foi " + 
                    enabled ? "habilitada, se a mensagem ainda não está configurado use o comando /config welcome para fazer isso" : "desabilitada"
                })
            } else {
                await client.prisma.welcome.create({
                    data: {
                        enabled,
                        guild: {
                            connectOrCreate: {
                                create: {
                                    dcId: interaction.guild!.id,
                                },
                                where: {
                                    dcId: interaction.guild!.id,
                                }
                            }
                        }
                    }
                }).then((result) => {
                    refreshCache(client, result)
                    replyMessage = "A mensagem de boas vindas foi " + 
                    enabled ? "habilitada, porém ainda será necessário configurar a mensagem usando o comando /config welcome" : "desabilitada"
                })
            }

            client.utils.createDefaultReply(interaction, replyMessage)
            return
        }
    }
}