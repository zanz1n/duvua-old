import { Command } from "../../lib/decorators/Command.js";
import { CommandBaseCategory, CommandBaseRunOpts, ICommand } from "../../lib/types/CommandBase.js";
import { 
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    GuildMember,
    PermissionFlagsBits
} from "discord.js";
import { createDefaultReply, embed as embedBuilder } from "../../utils/Embed.js";
import { RedisDbaService } from "../../services/RedisDbaService.js";

@Command({
    data: {
        name: "ticketadmin",
        description: "Comandos relacionados à administração de tickets",
        descriptionLocalizations: { "en-US": "Ticket administration related commands" },
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "delete",
                description: "Deleta o ticket de um usuário caso ele não tenha sido fechado",
                descriptionLocalizations: { "en-US": "Deletes a user's ticket in case it has not been closed" },
                options: [
                    {
                        type: ApplicationCommandOptionType.User,
                        name: "user",
                        description: "O usuário que deseja excluir o ticket",
                        descriptionLocalizations: { "en-US": "The user you want to delete the ticket" },
                        required: true
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "addpermanent",
                description: "Adiciona um botão de criação de ticket permanente num canal de texto",
                descriptionLocalizations: { "en-US": "Creates a permanent ticket create button in a text channel" },
                options: [
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "channel",
                        description: "O canal para criar o botão",
                        descriptionLocalizations: { "en-US": "The channel to create the button" },
                        required: true
                    },
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "message",
                        description: "O texto que vai acompanhar o botão",
                        descriptionLocalizations: { "en-US": "The text that will be shown with the button" },
                        required: false
                    }
                ]
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
        if (!interaction.guild) return;
        if (!interaction.member || !(interaction.member instanceof GuildMember)) return;

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            createDefaultReply(interaction, "Você não tem permissão para usar esse comando, {USER}");
            return;
        }
        
        const subCommand = interaction.options.getSubcommand();

        if (subCommand == "delete") {
            const user = interaction.options.getUser("user", true);
            const ticketDb = await this.redisDba.ticket.getById(`${interaction.guild.id}${user.id}`);
            if (!ticketDb) {
                createDefaultReply(interaction, `Nenhum ticket de ${user.username} foi encontrado, {USER}`);
                return;
            }
            client.channels.cache.get(ticketDb.channelId)?.delete();
            this.redisDba.ticket.deleteById(`${interaction.guild.id}${interaction.user.id}`);
            createDefaultReply(interaction, `Todos os tickets de ${user.username} foram deletados`);
        }
        else if (subCommand == "addpermanent") {
            const channelOpt = interaction.options.getChannel("channel", true);
            const channel = client.channels.cache.get(channelOpt.id);
            if (!channel || channel.type != ChannelType.GuildText) {
                createDefaultReply(interaction, "Selecione um canal de texto válido, {USER}");
                return;
            }

            const embed = embedBuilder();
            
            const message = interaction.options.getString("message");

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("permanent-ticket")
                    .setEmoji("#️⃣")
                    .setLabel("Criar Ticket")
                    .setStyle(ButtonStyle.Primary)
            );

            if (message) {
                embed.setDescription(message);
                embed.setFooter({
                    text: `Mensagem por ${interaction.user.username}`,
                    iconURL: interaction.member.displayAvatarURL({ forceStatic: true })
                    ?? interaction.user.displayAvatarURL({ forceStatic: true })
                });
            } else {
                embed.setDescription("**Clique no botão para criar um ticket**");
            }
            createDefaultReply(interaction, "Ticket permanente criado com sucesso, {USER}");
            channel.send({ embeds: [embed], components: [row] });
            return;
        }
    }
}
