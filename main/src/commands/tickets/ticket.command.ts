import { men } from "../../utils/mention.js";
import { Command } from "../../lib/decorators/Command.js";
import { CommandBaseCategory, CommandBaseRunOpts, ICommand } from "../../lib/types/CommandBase.js";
import { 
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ComponentType,
    GuildMember
} from "discord.js";
import { createDefaultReply, embed as embedBuilder } from "../../utils/Embed.js";
import { Logger } from "../../lib/Logger.js";
import { ticketCreationHandler } from "./ticket.js";
import { RedisDbaService } from "../../services/RedisDbaService.js";

@Command({
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
    enabled: true,
    ephemeral: false,
    category: CommandBaseCategory.MODUTIL,
    needsDefer: true

})
export default class implements ICommand<true> {
    constructor(private readonly redisDba: RedisDbaService) {}

    async run({ interaction, client }: CommandBaseRunOpts<true>) {
        if (!interaction.user) return;
        if (!interaction.channel) return;
        if (!interaction.member || !(interaction.member instanceof GuildMember)) return;
        if (!interaction.guild) return;

        const redisIdentifier = `${interaction.guild.id}${interaction.user.id}`;

        const subCommand = interaction.options.getSubcommand();

        if (subCommand == "delete") {
            const findDb = await this.redisDba.ticket.getById(redisIdentifier);

            if (findDb) {
                const channel = interaction.guild.channels.cache.get(findDb.channelId);

                if (channel) {
                    channel.delete("Removing ticket channels");
                }
                this.redisDba.ticket.deleteById(redisIdentifier),
                createDefaultReply(interaction, "Seu ticket foi deletado com sucesso, {USER}");
                return;
            }
            createDefaultReply(interaction, "Você não tem nenhum ticket criado, {USER}");
            return;
        }

        else if (subCommand == "create") {
            const findTicketDb = await this.redisDba.ticket.getById(redisIdentifier);

            if (findTicketDb) {
                const channel = client.channels.cache.get(findTicketDb.channelId);
                if (!channel) {
                    this.redisDba.ticket.deleteById(redisIdentifier);
                } else {
                    createDefaultReply(interaction, "Você já tem um ticket criado, {USER}");
                    return;
                }
            }

            const dateNow = Date.now();

            const confirmCreation = new ButtonBuilder()
                .setCustomId(`ticket-yes${dateNow}`)
                .setEmoji("✅")
                .setLabel("Sim")
                .setStyle(ButtonStyle.Success);

            const cancelCreation = new ButtonBuilder()
                .setCustomId(`ticket-no${dateNow}`)
                .setEmoji("❌")
                .setLabel("Não")
                .setStyle(ButtonStyle.Danger);

            const confirmationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                confirmCreation,
                cancelCreation
            );

            const confirmationEmbed = embedBuilder()
                .setDescription(`**Você realmente deseja criar o ticket, ${men(interaction.user)}?**`);

            if (interaction.channel.type == ChannelType.GuildText) {
                const confirmationCollector = interaction.channel.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    filter: (bntint) => bntint.user.id == interaction.user.id,
                    max: 1,
                    time: 1000 * 20
                });

                confirmationCollector.on("collect", async(i) => {
                    Logger.debug(i.customId);
                    if (i.customId == `ticket-yes${dateNow}`) {
                        Logger.debug(i.customId);
                        await ticketCreationHandler({i, client, pre: true, rDba: this.redisDba });
                    }
                    if (i.customId == `ticket-no${dateNow}`) {
                        const embed = embedBuilder()
                            .setDescription(`**Seu ticket foi cancelado com sucesso, ${men(interaction.user)}**`);
                        i.reply({ embeds: [embed] });
                    }
                });
    
                confirmationCollector.on("end", async() => {
                    confirmCreation.setDisabled(true);
                    cancelCreation.setDisabled(true);
    
                    await interaction.editReply({
                        components: [confirmationRow]
                    });
                });
            }

            await interaction.editReply({
                content: null,
                components: [confirmationRow],
                embeds: [confirmationEmbed]
            });
        }
    }
}
