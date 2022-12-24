import { ApplicationCommandOptionType, ButtonStyle, ComponentType } from "discord.js"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"
import { sButtonActionRow } from "../../types/discord/sMessageActionRow"
import { sMessageButton } from "../../types/discord/sMessageButton"
import { gifs_kiss, gifs_slap } from "../../utils/gifs"
import { random } from "../../modules/random"

export const command: CommandBase = {
    data: {
        name: "kiss",
        description: "Demonstre todo o seu amor a uma pessoa benjando-a",
        descriptionLocalizations: { "en-US": "Show all your love to a person kissing him" },
        options: [
            {
                name: "user",
                description: "A pessoa que você deseja beijar",
                descriptionLocalizations: { "en-US": "The user you want to kiss" },
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ]
    },
    enabled: true,
    ephemeral: false,
    category: CommandBaseCategory.FUN,
    needsDefer: true,

    async run({interaction, client}) {
        const embed = new sEmbed

        const user = interaction.options.getUser("user")
        if (!client.user) return
        if (!user) return
        if (!interaction.channel) return

        if (user.id == client.user.id) {
            embed.setDescription(`**Vamos manter nossa relação como uma amizade, ok ${interaction.user}?**`)
            await interaction.editReply({ embeds: [embed] })
            return
        }

        else if (user == interaction.user) {
            embed.setTitle("O amor está no ar!  :heart:")
                .setDescription(`${interaction.user} beijou ${user}`)
                .setImage(gifs_kiss[random(0, gifs_kiss.length)])
                .setFooter({
                    text: "Amar a si mesmo é bom!",
                })
            await interaction.editReply({ embeds: [embed] })
            return
        }

        const dateNow = Date.now()

        embed.setTitle("O amor está no ar!  :heart:")
            .setDescription(`${interaction.user} beijou ${user}`)
            .setImage(gifs_kiss[random(0, gifs_kiss.length)])
            .setFooter({
                text: `Requisitado por ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({
                    extension: "png",
                    forceStatic: true
                })
            })
        
        const repeat = new sMessageButton()
            .setCustomId(`repeat${dateNow}`)
            .setEmoji("🔁")
            .setLabel("Retribuir")
            .setStyle(ButtonStyle.Primary)

        const reject = new sMessageButton()
            .setCustomId(`reject${dateNow}`)
            .setEmoji("❌")
            .setLabel("Recusar")
            .setStyle(ButtonStyle.Primary)

        const row = new sButtonActionRow()
            .addComponents(reject, repeat)

        await interaction.editReply({
            content: null,
            embeds: [embed],
            components: [row]
        })

        const collector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            max: 1,
            time: 180000,
            filter: (btnInt) => btnInt.user.id == user.id
        })

        collector.on("collect", async (i) => {
            if (i.customId === `repeat${dateNow}`) {
                const embedRetribuir = new sEmbed().setTitle("As coisas estão pegando fogo aqui!  :fire:")
                    .setDescription(`${i.user} retribuiu o beijo de ${interaction.user}\nSerá que temos um novo casal aqui?  :heart:`)
                    .setImage(gifs_kiss[random(0, gifs_kiss.length)])

                await i.reply({ embeds: [embedRetribuir] })
            }
            else if (i.customId === `reject${dateNow}`) {
                const embedRetribuir = new sEmbed().setTitle(`Quem nunca levou um fora, né ${interaction.user.username}`)
                    .setDescription(`${i.user} negou o beijo de ${interaction.user}  :broken_heart:`)
                    .setImage(gifs_slap[random(0, gifs_slap.length)])

                await i.reply({ embeds: [embedRetribuir] })
            }
        })

        collector.on("end", async () => {
            repeat.setDisabled(true)
            reject.setDisabled(true)
            repeat.setDisabled(true)
            reject.setDisabled(true)
            await interaction.editReply({ components: [row] })
        })
    }
}
