import { ApplicationCommandOptionType, ChannelType, Collection, GuildMember, Message, PermissionFlagsBits } from "discord.js"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"
import { createMentionByUser as men } from "../../modules/createMentionByUser"

export const command: CommandBase = {
    category: CommandBaseCategory.MODUTIL,
    enabled: true,
    ephemeral: false,
    needsDefer: false,
    data: {
        name: "clear",
        description: "Limpa uma quantidade de mensagens do canal de texto",
        descriptionLocalizations: { "en-US": "Clears a certain amount of messages from the text channel" },
        defaultMemberPermissions: "ManageMessages",
        options: [
            {
                type: ApplicationCommandOptionType.Integer,
                name: "amount",
                description: "A quantidade de mensagens que deseja limpar",
                descriptionLocalizations: { "en-US": "The amount of messages you want to delete" },
                required: true
            },
            {
                type: ApplicationCommandOptionType.User,
                name: "user",
                description: "Adiciona um filtro de usuário para excluir as mensagens",
                descriptionLocalizations: { "en-US": "Adds a user filter to clear the messages" },
                required: false
            }
        ]
    },

    async run({interaction, client}) {
        if (!interaction.member || !(interaction.member instanceof GuildMember))
            throw new Error("!interaction.member || !(interaction.member instanceof GuildMember)")

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            await client.utils.createDefaultReply(interaction, "Você não tem permissão para usar esse comando, {USER}")
            return
        }
        if (!interaction.channel || interaction.channel.type != ChannelType.GuildText) return

        const amount = interaction.options.getInteger("amount", true)

        if (amount > 99) {
            await client.utils.createDefaultReply(interaction, "O maximo de mensagens que podem ser deletadas é 99, {USER}")
            return
        }

        const user = interaction.options.getUser("user")

        let statusMsg = ""
        let messages: Collection<string, Message> | null = null

        if (!interaction.channel || interaction.channel.type != ChannelType.GuildText)
            throw new Error("!interaction.channel || interaction.channel.type != ChannelType.GuildText")

        if (!user) {
            statusMsg = `${amount} mensagens foram removidas do canal de texto, ${men(interaction.user)}`
        } else {
            let cannotDeleteCount = 0
            const messagesRaw = await interaction.channel.messages.fetch({ limit: amount })
            messages = new Collection<string, Message<true>>()
            messagesRaw.forEach(msg => {
                if (msg.deletable && msg.author.id == user.id) messages!.set(msg.id, msg)
                else { cannotDeleteCount++ }
            })
            statusMsg = `${amount - cannotDeleteCount} mesagens de ${user.username} foram removidas do canal de texto, ${men(interaction.user)}`
        }
        await interaction.channel.bulkDelete(messages ?? amount)

        const embed = sEmbed.utils.defaultMessage(statusMsg)

        await interaction.reply({
            fetchReply: true,
            embeds: [embed],
            ephemeral: true
        })
    },
}
