import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ComponentType,
} from "discord.js";
import { Command } from "../../lib/decorators/Command.js";
import { CommandBaseCategory, CommandBaseRunOpts, ICommand } from "../../lib/types/CommandBase.js";
import { embed as embedBuilder } from "../../utils/Embed.js";
import { random } from "../../utils/lang.js";
import kissData from "./kissData.json" assert { type: "json" };

@Command({
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
    needsDefer: true
})
export default class implements ICommand<true> {
    async run({ interaction, client }: CommandBaseRunOpts<true>) {
        const embed = embedBuilder();

        const user = interaction.options.getUser("user");
        if (!user) return;
        if (!interaction.channel) return;

        if (user.id == client.user.id) {
            embed.setDescription(`**Vamos manter nossa relação como uma amizade, ok ${interaction.user}?**`);
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        else if (user == interaction.user) {
            embed.setTitle("O amor está no ar!  :heart:")
                .setDescription(`${interaction.user} beijou ${user}`)
                .setImage(kissData.gifsKiss[random(0, kissData.gifsKiss.length)])
                .setFooter({
                    text: "Amar a si mesmo é bom!",
                });
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const dateNow = Date.now();

        embed.setTitle("O amor está no ar!  :heart:")
            .setDescription(`${interaction.user} beijou ${user}`)
            .setImage(kissData.gifsKiss[random(0, kissData.gifsKiss.length)])
            .setFooter({
                text: `Requisitado por ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({
                    extension: "png",
                    forceStatic: true
                })
            });
        
        const repeat = new ButtonBuilder()
            .setCustomId(`repeat${dateNow}`)
            .setEmoji("🔁")
            .setLabel("Retribuir")
            .setStyle(ButtonStyle.Primary);

        const reject = new ButtonBuilder()
            .setCustomId(`reject${dateNow}`)
            .setEmoji("❌")
            .setLabel("Recusar")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(reject, repeat);

        await interaction.editReply({
            content: null,
            embeds: [embed],
            components: [row]
        });

        if (interaction.channel.type == ChannelType.GuildText) {
            const collector = interaction.channel.createMessageComponentCollector({
                componentType: ComponentType.Button,
                max: 1,
                time: 180000,
                filter: (btnInt) => btnInt.user.id == user.id
            });
    
            collector.on("collect", async(i) => {
                if (i.customId === `repeat${dateNow}`) {
                    const embedRetribuir = embedBuilder().setTitle("As coisas estão pegando fogo aqui!  :fire:")
                        .setDescription(`${i.user} retribuiu o beijo de ${interaction.user}\nSerá que temos um novo casal aqui?  :heart:`)
                        .setImage(kissData.gifsKiss[random(0, kissData.gifsKiss.length)]);
    
                    await i.reply({ embeds: [embedRetribuir] });
                }
                else if (i.customId === `reject${dateNow}`) {
                    const embedRetribuir = embedBuilder().setTitle(`Quem nunca levou um fora, né ${interaction.user.username}`)
                        .setDescription(`${i.user} negou o beijo de ${interaction.user}  :broken_heart:`)
                        .setImage(kissData.gifsSlap[random(0, kissData.gifsSlap.length)]);
    
                    await i.reply({ embeds: [embedRetribuir] });
                }
            });
    
            collector.on("end", async() => {
                repeat.setDisabled(true);
                reject.setDisabled(true);
                repeat.setDisabled(true);
                reject.setDisabled(true);
                await interaction.editReply({ components: [row] });
            });
        }
    }
}
