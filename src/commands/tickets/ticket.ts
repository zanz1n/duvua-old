import { ApplicationCommandOptionType, ButtonStyle, ComponentType, GuildBasedChannel, GuildMember } from "discord.js"
import { createMentionByUser } from "../../modules/createMentionByUser"
import { sleep } from "../../modules/sleep"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"
import { sButtonActionRow } from "../../types/discord/sMessageActionRow"
import { sMessageButton } from "../../types/discord/sMessageButton"

export const command: CommandBase = {
    category: CommandBaseCategory.MODUTIL,
    enabled: true,
    ephemeral: false,
    needsDefer: true,
    data: {
        name: "ticket",
        description: "Comandos para a criação de tickets",
        descriptionLocalizations: { "en-US": "Ticket realted commands" },
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "create",
                description: "Cria um ticket",
                descriptionLocalizations: { "en-US": "Creates a ticket" }
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "delete",
                description: "Deleta seus tickets caso você tenha um",
                descriptionLocalizations: { "en-US": "Deletes a ticket in case you have one open" }
            }
        ]
    },

    async run({interaction, client}) {
        if (!interaction.user) return
        if (!interaction.channel) return
        if (!interaction.member || !(interaction.member instanceof GuildMember)) return
        if (!interaction.guild) return

        const redisIdentifier = `${interaction.guild.id}${interaction.user.id}`

        const subCommand = interaction.options.getSubcommand()

        if (subCommand == "delete") {
            const findDb = await client.redisDba.ticket.getById(redisIdentifier)

            if (findDb) {
                const channel = interaction.guild.channels.cache.get(findDb.channelId)

                if (channel) {
                    channel.delete("Removing ticket channels")
                }
                client.redisDba.ticket.deleteById(redisIdentifier),
                client.utils.createDefaultReply(interaction, "Seu ticket foi deletado com sucesso, {USER}")
                return
            }
            client.utils.createDefaultReply(interaction, "Você não tem nenhum ticket criado, {USER}")
            return
        }

        else if (subCommand == "create") {
            const findTicketDb = await client.redisDba.ticket.getById(redisIdentifier)

            if (findTicketDb) {
                client.utils.createDefaultReply(interaction, "Você já tem um ticket criado, {USER}")
                return
            }

            const dateNow = Date.now()

            const confirmCreation = new sMessageButton()
                .setCustomId(`ticket-yes${dateNow}`)
                .setEmoji("✅")
                .setLabel("Sim")
                .setStyle(ButtonStyle.Success)

            const cancelCreation = new sMessageButton()
                .setCustomId(`ticket-no${dateNow}`)
                .setEmoji("❌")
                .setLabel("Não")
                .setStyle(ButtonStyle.Danger)

            const confirmationRow = new sButtonActionRow().addComponents(
                confirmCreation,
                cancelCreation
            )

            const confirmationEmbed = new sEmbed()
                .setDescription(`**Você realmente deseja criar o ticket, ${createMentionByUser(interaction.user)}?**`)

            const confirmationCollector = interaction.channel.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter: (bntint) => bntint.user.id == interaction.user.id,
                max: 1,
                time: 1000 * 20
            })

            await interaction.editReply({
                content: null,
                components: [confirmationRow],
                embeds: [confirmationEmbed]
            })

            confirmationCollector.on("collect", async (i) => {
                if (i.customId == `ticket-yes${dateNow}`) {
                    const channel = await interaction.guild!.channels.create({
                        name: `ticket-${interaction.user.tag}`,
                        permissionOverwrites: [
                            {
                                id: interaction.user.id,
                                allow: ["SendMessages", "ViewChannel"]
                            },
                            {
                                id: interaction.client.user.id,
                                allow: ["SendMessages", "ViewChannel"]
                            },
                            {
                                id: interaction.guild!.roles.everyone,
                                deny: ["SendMessages", "ViewChannel"]
                            }
                        ]
                    })

                    const dbCreation = client.redisDba.ticket.create({
                        id: redisIdentifier,
                        enabled: true,
                        channelId: channel.id
                    })

                    const ticketChannelEmbed = new sEmbed()
                        .setDescription("**Seu ticket foi criado aqui, clique no botão a baixo caso deseje deletá-lo**")

                    const ticketChannelCancelButton = new sMessageButton()
                        .setCustomId(`cancel-ticket${dateNow}`)
                        .setEmoji("❌")
                        .setLabel("Cancelar")
                        .setStyle(ButtonStyle.Danger)

                    const ticketChannelRow = new sButtonActionRow()
                        .addComponents(ticketChannelCancelButton)

                    const ticketChannelCollector = channel.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        filter: (btnint) => btnint.user.id == interaction.user.id,
                        max: 1,
                        time: 1000 * 120
                    })

                    const ticketChannelMessage = channel.send({
                        content: createMentionByUser(interaction.user),
                        embeds: [ticketChannelEmbed],
                        components: [ticketChannelRow]
                    })

                    ticketChannelCollector.on("collect", async (tci) => {
                        if (tci.customId == `cancel-ticket${dateNow}`) {
                            const data = await dbCreation

                            const channel = tci.guild!.channels.cache.get(data.channelId)
                            ?? await tci.guild!.channels.fetch(data.channelId)

                            if (channel) {
                                tci.deferUpdate()
                                sleep(1000).then(() => {
                                    Promise.all([
                                        channel.delete("Removing ticket channels"),
                                        client.redisDba.ticket.deleteById(redisIdentifier)
                                    ])
                                })
                            }
                            return
                        }
                    })

                    ticketChannelCollector.on("end", async () => {
                        ticketChannelCancelButton.setDisabled(true)
                        ticketChannelMessage.then(msg => msg.edit({
                            components: [ticketChannelRow]
                        })).catch(() => {
                            // Channel was already deleted
                        })
                    })

                    const embed = new sEmbed()
                        .setDescription(`**Seu ticket foi criado com sucesso, ${createMentionByUser(i.user)}**`)

                    const goToChannelRow = new sButtonActionRow().addComponents(
                        new sMessageButton()
                            .setLabel("Ir")
                            .setEmoji("🚀")
                            .setStyle(ButtonStyle.Link)
                            .setURL(`https://discord.com/channels/${interaction.guild!.id}/${channel.id}`)
                    )

                    i.reply({
                        embeds: [embed],
                        components: [goToChannelRow],
                        ephemeral: true
                    })

                }
                if (i.customId == `ticket-no${dateNow}`) {
                    const embed = new sEmbed()
                        .setDescription(`**Seu ticket foi cancelado com sucesso, ${createMentionByUser(interaction.user)}**`)
                    i.reply({ embeds: [embed] })
                }
            })

            confirmationCollector.on("end", async () => {
                confirmCreation.setDisabled(true)
                cancelCreation.setDisabled(true)

                await interaction.editReply({
                    components: [confirmationRow]
                })
            })
        }
    }
}
