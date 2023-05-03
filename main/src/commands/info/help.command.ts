import { CommandBaseCategory, CommandBaseRunOpts, ICommand } from "../../lib/types/CommandBase.js";
import { Command } from "../../lib/decorators/Command.js";
import { CacheService } from "../../services/RedisService.js";
import { EmbedsCacheType, loadFromCommand } from "./help.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ComponentType,
    EmbedBuilder
} from "discord.js";
import { additionalCommands } from "./additionalCommands.js";

@Command({
    data: {
        name: "help",
        description: "Mostra todos os comandos do bot e suas funções",
        descriptionLocalizations: { "en-US": "Shows all the commands of the bot and their functionalities" }
    },
    enabled: true,
    ephemeral: false,
    needsDefer: true,
    category: CommandBaseCategory.INFO
})
export default class implements ICommand<false> {
    constructor(private readonly redis: CacheService) {}
    
    async run({ interaction, client }: CommandBaseRunOpts<false>) {
        if (!interaction.guild) return;
        if (!interaction.channel) return;

        const dateNow = Date.now();

        let embeds: EmbedsCacheType;

        const embedsCache = await this.redis.get("help-embed-data-pt_BR");

        if (!embedsCache) {
            embeds = {
                index: new EmbedBuilder().setTitle("Help")
                    .setDescription(`
        **${client.user} pode fazer muitas coisas para o seu servidor.**
        O que inclui tocar músicas, ver avatar de usuários, beijar alguém e até fazer um meme, confira todos os comandos do bot abaixo:\n
        **:globe_with_meridians: - slash commands | :m: - legacy commands**\n
        :globe_with_meridians: - digite:  **/**  para ver as opções; :m: - podem ser usados com o prefixo escolhido no chat (padrão "-")`)

                    .addFields([{ name: "ℹ️ Categorias", value:"**Para visualizar todas as categorias e comandos use a caixa de seleção abaixo.**"}])

                    .setThumbnail(client.user?.displayAvatarURL() ?? "")

                    .setFooter({ text: `Requisitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() }).setTimestamp(),

                FUN: new EmbedBuilder().setTitle("🥳 Fun").setDescription("Comandos para descontrair"),
                INFO: new EmbedBuilder().setTitle("ℹ️ Info").setDescription("Comandos para ver informações uteis"),
                MODUTIL: new EmbedBuilder().setTitle("🖋️ Moderation / Utility").setDescription("Comandos para auxiliar na moderação e organização do server"),
                MUSIC: new EmbedBuilder().setTitle("🎧 Music").setDescription("Comandos para tocar músicas na call"),
                MONEYLEVEL: new EmbedBuilder().setTitle("💸 Money / Level").setDescription("Comandos relacionados ao sistema monetário e de ranks do bot")
            };

            client.commands.forEach((command) => {
                loadFromCommand(command.data, embeds[command.category]);
            });

            additionalCommands.forEach((acmd) => {
                loadFromCommand(acmd, embeds.MUSIC);
            });
        }
        else {
            embeds = JSON.parse(embedsCache) as EmbedsCacheType;
        }

        const buttons = {
            FUN: new ButtonBuilder()
                .setCustomId(`fun${dateNow}`)
                .setLabel("Fun")
                .setEmoji("🥳")
                .setStyle(ButtonStyle.Secondary),

            INFO: new ButtonBuilder()
                .setCustomId(`info${dateNow}`)
                .setLabel("Info")
                .setEmoji("ℹ️")
                .setStyle(ButtonStyle.Secondary),

            MODUTIL: new ButtonBuilder()
                .setCustomId(`mod-util${dateNow}`)
                .setLabel("Moderation / Utility")
                .setEmoji("🖋️")
                .setStyle(ButtonStyle.Secondary),
                
            MUSIC: new ButtonBuilder()
                .setCustomId(`music${dateNow}`)
                .setLabel("Music")
                .setEmoji("🎧")
                .setStyle(ButtonStyle.Secondary),

            MONEYLEVEL: new ButtonBuilder()
                .setCustomId(`money${dateNow}`)
                .setLabel("Money / Level")
                .setEmoji("💸")
                .setStyle(ButtonStyle.Secondary)
        };

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(buttons.FUN, buttons.INFO, buttons.MODUTIL, buttons.MUSIC, buttons.MONEYLEVEL);

        if (interaction.channel.type == ChannelType.GuildText) {
            const collector = interaction.channel.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter: (slint) => slint.user.id == interaction.user.id,
                time: 60000
            });

            collector.on("collect", async(i) => {
                switch (i.customId) {
                case `fun${dateNow}`:
                    i.deferUpdate();
                    interaction.editReply({ embeds: [embeds.FUN] });
                    break;
                case `info${dateNow}`:
                    i.deferUpdate();
                    interaction.editReply({ embeds: [embeds.INFO] });
                    break;
                case `mod-util${dateNow}`:
                    i.deferUpdate();
                    interaction.editReply({ embeds: [embeds.MODUTIL] });
                    break;
                case `music${dateNow}`:
                    i.deferUpdate();
                    interaction.editReply({ embeds: [embeds.MUSIC] });
                    break;
                case `money${dateNow}`:
                    i.deferUpdate();
                    interaction.editReply({ embeds: [embeds.MONEYLEVEL] });
                    break;
                }
            });
    
            collector.on("end", () => {
                buttons.FUN.setDisabled(true);
                buttons.INFO.setDisabled(true);
                buttons.MODUTIL.setDisabled(true);
                buttons.MONEYLEVEL.setDisabled(true);
                buttons.MUSIC.setDisabled(true);
    
                interaction.editReply({ components: [row] });
            });
        }

        interaction.editReply({
            content: null,
            embeds: [embeds.index],
            components: [row]
        });

        this.redis.set("help-embed-data-pt_BR", JSON.stringify(embeds));
    }
}

