import { embed as createEmbed } from "../../utils/Embed.js";
import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ComponentType
} from "discord.js";
import { Command } from "../../lib/decorators/Command.js";
import { CommandBaseCategory, CommandBaseRunOpts, ICommand } from "../../lib/types/CommandBase.js";
import { KitsuService } from "../../services/kitsu.io/index.js";
import { men } from "../../utils/mention.js";

@Command({
    data: {
        name: "anime",
        description: "Pesquisa por um anime e mostra informações relevantes",
        descriptionLocalizations: { "en-US": "Search for an anime and shows relevant information" },
        options: [
            {
                name: "name",
                description: "O nome do anime que deseja buscar",
                descriptionLocalizations: { "en-US": "The name of the anime you want to search" },
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    category: CommandBaseCategory.INFO,
    enabled: true,
    ephemeral: false,
    needsDefer: true,
})
export default class implements ICommand<true> {
    constructor(
        private readonly kitsu: KitsuService
    ) {}
    async run({ interaction }: CommandBaseRunOpts<true>) {
        if (!interaction.channel) return;
        const searchName = interaction.options.getString("name", true);

        const embed = createEmbed();

        if (searchName.length > 50) {
            embed.setDescription(`**Nomes muito longos/ > 50 tendem a não retornar resultados, ${men(interaction.user)}**`);
            interaction.editReply({ content: null, embeds: [embed] });
            return;
        }

        const data = await this.kitsu.getAnimeFromName(searchName);
        if (!data) {
            embed.setDescription(`**Não foi possível encontrar um anime com o nome \`${searchName}\`, ${men(interaction.user)}**`);
            interaction.editReply({ content: null, embeds: [embed] });
            return;
        }
        const MAX_SYNOPSIS_LENGTH = 560;

        const components: ActionRowBuilder<ButtonBuilder>[] = [];

        let synopsis = data.synopsis;
        if (synopsis.length > MAX_SYNOPSIS_LENGTH) {
            const dateNow = Date.now();
            synopsis = data.synopsis.slice(0, MAX_SYNOPSIS_LENGTH - 40) 
            + " [...] " + data.synopsis.slice(data.synopsis.length - 40, data.synopsis.length);
            const button = new ButtonBuilder()
                .setCustomId(`full-synopsis${dateNow}`)
                .setDisabled(false)
                .setStyle(ButtonStyle.Primary)
                .setLabel("Ver Sinopse Completa");
            components.push(new ActionRowBuilder<ButtonBuilder>().addComponents(button));

            if (interaction.channel.type == ChannelType.GuildText) {
                const collector = await interaction.channel.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    filter: (bntint) => bntint.user.id == interaction.user.id,
                    max: 1,
                    time: 20000
                });
    
                collector.on("collect", async(i) => {
                    if (i.customId == `full-synopsis${dateNow}`) {
                        i.reply(`\`${data.synopsis}\``);
                    }
                });
    
                collector.on("end", async() => {
                    button.setDisabled(true);
                    interaction.editReply({ components });
                });
            }
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
            .setTimestamp();
        
        if (!embed.data.image) {
            embed.setThumbnail(data.posterImage?.original ?? null);
        }

        await interaction.editReply({ content: null, embeds: [embed], components });
        return;
    }
}
