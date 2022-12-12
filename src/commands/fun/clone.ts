import { ApplicationCommandOptionType, ChannelType, GuildMember, ImageURLOptions, TextChannel } from "discord.js"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"
import { createMentionByUser as men } from "../../modules/createMentionByUser"
import { sleep } from "../../modules/sleep"

export const command: CommandBase = {
    category: CommandBaseCategory.FUN,
    enabled: true,
    ephemeral: true,
    needsDefer: true,
    data: {
        name: "clone",
        description: "Cria um clone de alguém",
        options: [
            {
                name: "user",
                description: "Quem você deseja fazer o clone",
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: "message",
                description: "O que você deseja fazer o usuário enviar no canal de texto",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },

    async run({interaction, client}) {
        const user = interaction.options.getUser("user", true)
        const member = interaction.options.getMember("user")

        if (!member || !(member instanceof GuildMember)) return
        if (!interaction.channel || !(interaction.channel.type == ChannelType.GuildText)) return

        const message = interaction.options.getString("message", true)

        const options: ImageURLOptions = {
            forceStatic: true,
        }

        const avatar = member.displayAvatarURL(options) ?? user.displayAvatarURL(options)
        const name = member.nickname ?? user.username

        interaction.channel.createWebhook({ name, avatar, reason: "Clone command" })
            .then(async (webhook) => {
                webhook.send(message)
                sleep(10000).then(() => webhook.delete())
            })

        const embed = sEmbed.utils.defaultMessage(`O webhhok foi criado, ${men(interaction.user)}`)
        interaction.editReply({ content: null, embeds: [embed] })
    },
}
