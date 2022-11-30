import { ApplicationCommandOptionType, ButtonStyle, ComponentType, GuildMember } from "discord.js"
import { createMentionByUser } from "../../modules/createMentionByUser"
import { logger } from "../../modules/logger"
import { sleep } from "../../modules/sleep"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"
import { sButtonActionRow } from "../../types/discord/sMessageActionRow"
import { sMessageButton } from "../../types/discord/sMessageButton"
import { ticketDbData } from "../../types/redis/ticketDbData"

export const command: CommandBase = {
    category: CommandBaseCategory.TICKET,
    enabled: true,
    ephemeral: false,
    needsDefer: true,
    data: {
        name: "ticket",
        description: "Comandos para a criação de tickets",
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "create",
                description: "Cria um ticket"
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "delete",
                description: "Deleta seus tickets caso você tenha um"
            }
        ]
    },

    async run({interaction, client}) {
        if (!interaction.user) return
        if (!interaction.channel) return
        if (!interaction.member || !(interaction.member instanceof GuildMember)) return
        if (!interaction.guild) return

        const redisIdentifier = `ticket-${interaction.guild.id}${interaction.user.id}`

        const subCommand = interaction.options.getSubcommand()

        if (subCommand == "delete") {
            const embed = new sEmbed()
            const findDb = await client.redis.get(redisIdentifier)

            if (findDb) {
                const data = JSON.parse(findDb) as ticketDbData

                const channel = await interaction.guild.channels.cache.get(data.channelId)

                if (channel) {
                    await channel.delete("Removing ticket channels")
                    await client.redis.del(redisIdentifier)
                }
                embed.setDescription(`**Seu ticket foi deletado com sucesso, ${createMentionByUser(interaction.user)}**`)
                await interaction.editReply({
                    content: null,
                    embeds: [embed]
                })
                return
            }
            embed.setDescription(`**Você não tem nenhum ticket criado, ${createMentionByUser(interaction.user)}**`)
            await interaction.editReply({
                content: null,
                embeds: [embed]
            })
            return
        }

        if (subCommand == "create") {
            const findTicketDb = await client.redis.get(redisIdentifier)

            if (findTicketDb) {
                const embed = new sEmbed()
                    .setDescription(`**Você já tem um ticket criado ${createMentionByUser(interaction.user)}**`)
                interaction.editReply({
                    content: null,
                    embeds: [embed]
                })
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

                    const ticketInfo: ticketDbData = {
                        enabled: true,
                        channelId: channel.id
                    }
                    await client.redis.set(redisIdentifier, JSON.stringify(ticketInfo))

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

                    ticketChannelCollector.on("collect", async (tci) => {
                        logger.debug("AAAA")
                        if (tci.customId == `cancel-ticket${dateNow}`) {
                            const findDb = await client.redis.get(redisIdentifier)

                            if (findDb) {
                                const data = JSON.parse(findDb) as ticketDbData

                                const channel = await tci.guild!.channels.cache.get(data.channelId)

                                if (channel) {
                                    tci.deferUpdate()
                                    await sleep(1000)
                                    await channel.delete("Removing ticket channels")
                                    await client.redis.del(redisIdentifier)
                                }
                                return
                            }
                            return
                        }
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

                    channel.send({
                        content: createMentionByUser(interaction.user),
                        embeds: [ticketChannelEmbed],
                        components: [ticketChannelRow]
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