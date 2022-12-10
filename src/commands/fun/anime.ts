import { ApplicationCommandOptionType, ButtonStyle } from "discord.js"
import { createMentionByUser as men } from "../../modules/createMentionByUser"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"
import { sButtonActionRow } from "../../types/discord/sMessageActionRow"
import { sMessageButton } from "../../types/discord/sMessageButton"

export const command: CommandBase = {
    category: CommandBaseCategory.FUN,
    enabled: true,
    ephemeral: false,
    needsDefer: true,
    data: {
        name: "anime",
        description: "Pesquisa por um anime e mostra informações relevantes",
        options: [
            {
                name: "name",
                description: "O nome do anime que deseja buscar",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    async run({interaction, client}) {
        const searchName = interaction.options.getString("name", true)

        const embed = new sEmbed()

        if (searchName.length > 50) {
            embed.setDescription(`**Nomes muito longos/ > 50 tendem a não retornar resultados, ${men(interaction.user)}**`)
            interaction.editReply({ content: null, embeds: [embed] })
            return
        }

        const data = await client.kitsu.getAnimeFromName(searchName)
        if (!data) {
            embed.setDescription(`**Não foi possível encontrar um anime com o nome \`${searchName}\`, ${men(interaction.user)}**`)
            interaction.editReply({ content: null, embeds: [embed] })
            return
        }
        const MAX_SYNOPSIS_LENGTH = 560

        const components: sButtonActionRow[] = []

        let synopsis = data.synopsis
        if (synopsis.length > MAX_SYNOPSIS_LENGTH) {
            const dateNow = Date.now()
            synopsis = data.synopsis.slice(0, MAX_SYNOPSIS_LENGTH - 40) 
            + " [...] " + data.synopsis.slice(data.synopsis.length - 40, data.synopsis.length)
            // const button = new sMessageButton()
            //     .setCustomId(`full-synopsis${dateNow}`)
            //     .setDisabled(false)
            //     .setStyle(ButtonStyle.Primary)
            //     .setLabel("Ver Sinopse Completa")
            // components.push(new sButtonActionRow().addComponents(button))
        }

        embed.addFields([
            {
                name: "Tipo",
                value: `${data.showType ?? "N/A"}`,
                inline: true
            },
            {
                name: "Lançamento",
                value: `${data.startDate?.split("-").reverse().join("/") ?? "N/A"}`,
                inline: true
            },
            {
                name: "Gêneros",
                value: `${(data.genres) && (data.genres?.length > 1) ? data.genres?.join(", ") : "N/A"}`,
                inline: true
            },
            {
                name: "Episódios",
                value: `${data.episodeCount?.toString() ?? "N/A"}`,
                inline: true
            },
            {
                name: "Rank",
                value: `${data.popularityRank ? data.popularityRank.toString() + "°" : "N/A"}`,
                inline: true
            },
            {
                name: "Status",
                value: `${data.status ?? "N/A"}`,
                inline: true
            },
            {
                name: "Classificação",
                value: `${data.ageRatingGuide ?? "N/A"}`,
                inline: true
            },
            {
                name: "Trailer",
                value: `${data.youtubeVideoId ? `[Link](https://www.youtube.com/watch?v=${data.youtubeVideoId})` : "N/A"}`,
                inline: true
            },
            {
                name: "Tempo de Episódio",
                value: `${data.episodeLength ? `${data.episodeLength.toString()} minutos` : "N/A"}`,
                inline: true
            },
            {
                name: "Sinopse",
                value: `${synopsis}`,
                inline: false
            }

        ])
            .setFooter({
                text: `Requisitado por ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ forceStatic: true })
            })
            .setTitle(`**${data.titles.ja_jp ?? ""} | ${data.titles.en ?? data.canonicalTitle ?? ""}**`)
            .setImage(data.coverImage?.large ?? data.coverImage?.original ?? null)
            .setTimestamp()
        
        if (!embed.data.image) {
            embed.setThumbnail(data.posterImage?.original ?? null)
        }

        await interaction.editReply({ content: null, embeds: [embed], components })
        return
    },
}
