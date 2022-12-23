import { ApplicationCommandOptionType, GuildMember, PermissionFlagsBits } from "discord.js"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"
import { createMentionByUser as men } from "../../modules/createMentionByUser"

export const command: CommandBase = {
    category: CommandBaseCategory.TICKET,
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
    }
}