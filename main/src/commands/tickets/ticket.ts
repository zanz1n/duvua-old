import { 
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ComponentType,
    PermissionFlagsBits
} from "discord.js";
import { Client } from "../../lib/Client.js";
import { TicketData } from "../../services/redis/Ticket.js";
import { sleep } from "../../utils/lang.js";
import { men } from "../../utils/mention.js";
import { embed as embedBuilder } from "../../utils/Embed.js";
import { RedisDbaService } from "../../services/RedisDbaService.js";

export interface TicketCreationProps {
    i: ButtonInteraction;
    client: Client<true>;
    pre: boolean;
    rDba: RedisDbaService;
}

export async function ticketCreationHandler({ i, client, pre, rDba }: TicketCreationProps) {

    if (!i.guild) return;

    const redisIdentifier = `${i.guild.id}${i.user.id}`;

    let findTicketDb: TicketData | null = null;

    if (!pre) {
        findTicketDb = await rDba.ticket.getById(redisIdentifier);
    }

    if (findTicketDb) {
        const channel = client.channels.cache.get(findTicketDb.channelId);
        if (!channel) {
            rDba.ticket.deleteById(redisIdentifier);
        } else {
            i.reply({
                ephemeral: true,
                embeds: [embedBuilder(`Você já tem um ticket criado, ${men(i.user)}`)]
            });
            return;
        }
    }

    const dateNow = Date.now();

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
    });

    const dbCreation = rDba.ticket.create({
        id: redisIdentifier,
        enabled: true,
        channelId: channel.id
    });

    const ticketChannelEmbed = embedBuilder()
        .setDescription("**Seu ticket foi criado aqui, clique no botão a baixo caso " +
        "deseje deletá-lo, ou use o comando** `/ticket delete`\n" +
        "Administradores podem usar o comando `/ticketadmin delete <usuário>`");

    const ticketChannelCancelButton = new ButtonBuilder()
        .setCustomId(`cancel-ticket${dateNow}`)
        .setEmoji("❌")
        .setLabel("Cancelar")
        .setStyle(ButtonStyle.Danger);

    const ticketChannelRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(ticketChannelCancelButton);

    const ticketChannelCollector = channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (btnint) => btnint.user.id == i.user.id ||
            btnint.member.permissions.has(PermissionFlagsBits.Administrator),
        max: 1
    });

    const ticketChannelMessage = channel.send({
        content: men(i.user),
        embeds: [ticketChannelEmbed],
        components: [ticketChannelRow]
    });

    ticketChannelCollector.on("collect", async(tci) => {
        if (!tci.guild) throw new Error();
        if (tci.customId == `cancel-ticket${dateNow}`) {
            const data = await dbCreation;

            const channel = tci.guild.channels.cache.get(data.channelId)
            ?? await tci.guild.channels.fetch(data.channelId);

            if (channel) {
                tci.deferUpdate();
                sleep(1000).then(() => {
                    Promise.all([
                        channel.delete("Removing ticket channels"),
                        rDba.ticket.deleteById(redisIdentifier)
                    ]);
                });
            }
            return;
        }
    });

    ticketChannelCollector.on("end", async() => {
        ticketChannelCancelButton.setDisabled(true);
        ticketChannelMessage.then(msg => msg.edit({
            components: [ticketChannelRow]
        })).catch(() => {
            // Channel was already deleted
        });
    });

    const embed = embedBuilder()
        .setDescription(`**Seu ticket foi criado com sucesso, ${men(i.user)}**`);

    const goToChannelRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel("Ir")
            .setEmoji("🚀")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/channels/${i.guild.id}/${channel.id}`)
    );

    i.reply({
        embeds: [embed],
        components: [goToChannelRow],
        ephemeral: true
    });
}
