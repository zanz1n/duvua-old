import { ApplicationCommandOptionType, ChannelType, GuildMember, PermissionFlagsBits } from "discord.js"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { Duvua } from "../../Client"
import { Welcome } from "@prisma/client"

async function refreshCache(client: Duvua, data: Welcome) {
    const cache = await client.redis.getex(`welcome-${data.guildDcId}`, "EX", 120)
    if (cache) {
        await client.redis.set(`welcome-${data.guildDcId}`, JSON.stringify(data), "EX", 120)
    }
}

export const command: CommandBase = {
    category: CommandBaseCategory.CONFIG,
    enabled: true,
    ephemeral: false,
    needsDefer: true,
    data: {
        name: "config",
        description: "Comandos de configuração do bot",
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "welcome",
                description: "Altera a mensagem de boas vindas do servidor",
                options: [
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "canal",
                        description: "O canal que você deseja usar para as mensagens",
                        required: true
                    },
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "mensagem",
                        description: "A mensagem de boas vindas que será exibida",
                        required: true
                    },
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "tipo",
                        description: "O tipo de mensagem de boas vindas",
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
            const channel = interaction.options.getChannel("canal", true)

            if (channel.type != ChannelType.GuildText) {
                client.utils.createDefaultReply(interaction, "Você precisa selecionar um canal de texto válido, {USER}")
                return
            }

            const message = interaction.options.getString("mensagem", true)

            if (message.length > 250) {
                client.utils.createDefaultReply(interaction, "O tamanho máximo da mensagem é de 250 caratéres")
                return
            }

            const contentType = interaction.options.getString("tipo", true) as "MESSAGE" | "EMBED" | "IMAGE"

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
                        type: contentType
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
    }
}
