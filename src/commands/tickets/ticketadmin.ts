import { ApplicationCommandOptionType, ButtonStyle, ChannelType, GuildMember, PermissionFlagsBits } from "discord.js"
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

    async run({interaction, client}) {
        if (!interaction.guild) return
        if (!interaction.member || !(interaction.member instanceof GuildMember)) return

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            client.utils.createDefaultReply(interaction, "Você não tem permissão para usar esse comando, {USER}")
            return
        }
        
        const subCommand = interaction.options.getSubcommand()

        if (subCommand == "delete") {
            const user = interaction.options.getUser("user", true)
            const ticketDb = await client.redisDba.ticket.getById(`${interaction.guild.id}${user.id}`)
            if (!ticketDb) {
                client.utils.createDefaultReply(interaction, `Nenhum ticket de ${user.username} foi encontrado, {USER}`)
                return
            }
            client.channels.cache.get(ticketDb.channelId)?.delete()
            client.redisDba.ticket.deleteById(`${interaction.guild.id}${interaction.user.id}`)
            client.utils.createDefaultReply(interaction, `Todos os tickets de ${user.username} foram deletados`)
        }
        else if (subCommand == "addpermanent") {
            const channelOpt = interaction.options.getChannel("channel", true)
            const channel = client.channels.cache.get(channelOpt.id)
            if (!channel || channel.type != ChannelType.GuildText) {
                client.utils.createDefaultReply(interaction, "Selecione um canal de texto válido, {USER}")
                return
            }

            const embed = new sEmbed()
            
            const message = interaction.options.getString("message")

            const row = new sButtonActionRow().addComponents(
                new sMessageButton()
                    .setCustomId("permanent-ticket")
                    .setEmoji("#️⃣")
                    .setLabel("Criar Ticket")
                    .setStyle(ButtonStyle.Primary)
            )

            if (message) {
                embed.setDescription(message)
                embed.setFooter({
                    text: `Mensagem por ${interaction.user.username}`,
                    iconURL: interaction.member.displayAvatarURL({ forceStatic: true })
                    ?? interaction.user.displayAvatarURL({ forceStatic: true })
                })
            } else {
                embed.setDescription("**Clique no botão para criar um ticket**")
            }
            client.utils.createDefaultReply(interaction, "Ticket permanente criado com sucesso, {USER")
            channel.send({ embeds: [embed], components: [row] })
            return
        }
    }
}
