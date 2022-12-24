import { ButtonInteraction, ButtonStyle, ComponentType } from "discord.js"
import { Duvua } from "../Client"
import { sEmbed } from "../types/discord/sEmbed"
import { createMentionByUser } from "../modules/createMentionByUser"
import { sButtonActionRow } from "../types/discord/sMessageActionRow"
import { sleep } from "../modules/sleep"
import { sMessageButton } from "../types/discord/sMessageButton"

type opts = {
    i: ButtonInteraction
    client: Duvua
}

export async function permanentTicketHandler({i, client}: opts) {
    if (!i.guild) return
    if (i.customId != "permanent-ticket") return

    const redisIdentifier = `${i.guild.id}${i.user.id}`

    const findTicketDb = await client.redisDba.ticket.getById(redisIdentifier)

    if (findTicketDb) {
        i.reply({
            ephemeral: true,
            embeds: [sEmbed.utils.defaultMessage(`Você já tem um ticket criado, ${createMentionByUser(i.user)}`)]
        })
        return
    }

    const dateNow = Date.now()

    const channel = await i.guild.channels.create({
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
                id: i.guild.roles.everyone,
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
        filter: (btnint) => btnint.user.id == i.user.id,
        max: 1,
        time: 1000 * 120
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
            .setURL(`https://discord.com/channels/${i.guild.id}/${channel.id}`)
    )

    i.reply({
        embeds: [embed],
        components: [goToChannelRow],
        ephemeral: true
    })
}
