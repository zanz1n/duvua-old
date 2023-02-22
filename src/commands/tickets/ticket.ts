import { ApplicationCommandOptionType, ButtonInteraction, ButtonStyle, ComponentType, GuildMember, PermissionFlagsBits } from "discord.js"
import { createMentionByUser } from "../../modules/createMentionByUser"
import { sleep } from "../../modules/sleep"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"
import { sButtonActionRow } from "../../types/discord/sMessageActionRow"
import { sMessageButton } from "../../types/discord/sMessageButton"
import { Duvua } from "../../Client"
import { logger } from "../../modules/logger"
import { TicketData } from "../../redis/dba/Ticket"
import { ChannelType } from "discord.js"

export async function ticketCreationHandler({i, client, pre}: { i: ButtonInteraction, client: Duvua, pre: boolean }) {

    if (!i.guild) return

    const redisIdentifier = `${i.guild.id}${i.user.id}`

    let findTicketDb: TicketData | null = null

    if (!pre) {
        findTicketDb = await client.redisDba.ticket.getById(redisIdentifier)
    }

    if (findTicketDb) {
        const channel = client.channels.cache.get(findTicketDb.channelId)
        if (!channel) {
            client.redisDba.ticket.deleteById(redisIdentifier)
        } else {
            i.reply({
                ephemeral: true,
                embeds: [sEmbed.utils.defaultMessage(`Você já tem um ticket criado, ${createMentionByUser(i.user)}`)]
            })
            return
        }
    }

    const dateNow = Date.now()

    const channel = await i.guild!.channels.create({
        name: `ticket-${i.user.tag}`,
        permissionOverwrites: [
            {
                id: i.user.id,
                allow: ["SendMessages", "ViewChannel"]
            },
            {
                id: i.client.user.id,
                allow: ["SendMessages", "ViewChannel"]
            },
            {
                id: i.guild!.roles.everyone,
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
        .setDescription("**Seu ticket foi criado aqui, clique no botão a baixo caso " +
        "deseje deletá-lo, ou use o comando** `/ticket delete`\n" +
        "Administradores podem usar o comando `/ticketadmin delete <usuário>`")

    const ticketChannelCancelButton = new sMessageButton()
        .setCustomId(`cancel-ticket${dateNow}`)
        .setEmoji("❌")
        .setLabel("Cancelar")
        .setStyle(ButtonStyle.Danger)

    const ticketChannelRow = new sButtonActionRow()
        .addComponents(ticketChannelCancelButton)

    const ticketChannelCollector = channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (btnint) => btnint.user.id == i.user.id ||
            btnint.member.permissions.has(PermissionFlagsBits.Administrator),
        max: 1
    })

    const ticketChannelMessage = channel.send({
        content: createMentionByUser(i.user),
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
            .setURL(`https://discord.com/channels/${i.guild!.id}/${channel.id}`)
    )

    i.reply({
        embeds: [embed],
        components: [goToChannelRow],
        ephemeral: true
    })
}

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
                const channel = client.channels.cache.get(findTicketDb.channelId)
                if (!channel) {
                    client.redisDba.ticket.deleteById(redisIdentifier)
                } else {
                    client.utils.createDefaultReply(interaction, "Você já tem um ticket criado, {USER}")
                    return
                }
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

            if (interaction.channel.type == ChannelType.GuildText) {
                const confirmationCollector = interaction.channel.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    filter: (bntint) => bntint.user.id == interaction.user.id,
                    max: 1,
                    time: 1000 * 20
                })

                confirmationCollector.on("collect", async (i) => {
                    logger.info(i.customId)
                    if (i.customId == `ticket-yes${dateNow}`) {
                        logger.info(i.customId)
                        await ticketCreationHandler({i, client, pre: true})
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

            await interaction.editReply({
                content: null,
                components: [confirmationRow],
                embeds: [confirmationEmbed]
            })
        }
    }
}
