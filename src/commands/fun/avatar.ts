import { ApplicationCommandOptionType, GuildMember, ImageURLOptions } from "discord.js"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"

export const command: CommandBase = {
    data: {
        name: "avatar",
        description: "Mostra o avatar de um usuário",
        descriptionLocalizations: { "en-US": "Show a user's avatar" },
        options: [
            {
                name: "user",
                nameLocalizations: { "pt-BR": "usuário" },
                description: "De quem deseja exibir o avatar",
                descriptionLocalizations: { "en-US": "Whose avatar you want to show" },
                type: ApplicationCommandOptionType.User,
                required: false
            }
        ]
    },
    enabled: true,
    ephemeral: false,
    category: CommandBaseCategory.FUN,
    needsDefer: true,
    
    async run({interaction}) {
        const user = interaction.options.getUser("user") ?? interaction.user
        let member = interaction.options.getMember("user") ?? interaction.member

        if (!(member instanceof GuildMember)) member = null
        if (!user) return

        const authorImageOptions: ImageURLOptions = {
            extension: "png",
            size: 128,
            forceStatic: true
        }

        const imageOptions: ImageURLOptions = {
            size: 256,
        }

        const name = member?.nickname ?? user.username

        const iconurl = member?.displayAvatarURL(authorImageOptions) ?? user.displayAvatarURL(authorImageOptions)

        const embed = new sEmbed()
            .setAuthor({
                name: `Avatar de ${name}`,
                iconURL: iconurl,
            })
            .setImage(member?.displayAvatarURL(imageOptions) ?? user.displayAvatarURL(imageOptions))
            .setDescription(`**Clique [aqui](${member?.displayAvatarURL() ?? user.displayAvatarURL()}) para ver original**`)
            .setFooter({
                text: `Requisitado por ${user.username}`,
                iconURL: iconurl,
            })

        interaction.editReply({
            content: null,
            embeds: [embed]
        })
    },
}