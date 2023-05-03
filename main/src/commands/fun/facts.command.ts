import { ApplicationCommandOptionType, EmbedFooterOptions } from "discord.js";
import { Command } from "../../lib/decorators/Command.js";
import { CommandBaseCategory, CommandBaseRunOpts, ICommand } from "../../lib/types/CommandBase.js";
import { embed as embedBuilder } from "../../utils/Embed.js";
import { random } from "../../utils/lang.js";
import { Logger } from "../../lib/Logger.js";

@Command({
    data: {
        name: "facts",
        description: "Exibe curiosidades sobre números",
        descriptionLocalizations: { "en-US": "Shows facts about numbers" },
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "year",
                description: "Exibe curiosidades sobre um ano",
                descriptionLocalizations: { "en-US": "Shows facts about a year" },
                options: [
                    {
                        name: "number",
                        description: "O ano que você deseja saber sobre",
                        descriptionLocalizations: { "en-US": "The year you want to know about" },
                        type: ApplicationCommandOptionType.Number,
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: "number",
                description: "Exibe curiosidades sobre um número",
                descriptionLocalizations: { "en-US": "Shows facts about a number" },
                options: [
                    {
                        name: "number",
                        description: "O número que você deseja saber sobre",
                        descriptionLocalizations: { "en-US": "The number you want to know about" },
                        type: ApplicationCommandOptionType.Number,
                        required: true
                    }
                ]
            }
        ]
    },
    enabled: true,
    ephemeral: false,
    category: CommandBaseCategory.FUN,
    needsDefer: true
})
export default class implements ICommand<true> {
    async run({ interaction }: CommandBaseRunOpts<true>) {
        const subCommand = interaction.options.getSubcommand();

        const number = interaction.options.getNumber("number", true).toString();
        const embedFooter: EmbedFooterOptions = {
            text: `Requisitado por ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ forceStatic: true })
        };

        if (subCommand == "year") {
            const result = await fetch(`http://numbersapi.com/${number}/year`)
                .then(res => res.text())
                .catch((err) => {
                    Logger.error(err);
                    const randomanswers = [
                        "is the year that nothing remarkable happened.",
                        "is the year that we do not know what happened.",
                        "is the year that nothing interesting came to pass.",
                        "is the year that the Earth probably went around the Sun."
                    ];
                    return number + randomanswers[random(0, randomanswers.length)];
                });
            
            interaction.editReply({
                content: null,
                embeds: [embedBuilder(result).setFooter(embedFooter)]
            });
            return;
        }
        else if (subCommand == "number") {
            const result = await fetch(`http://numbersapi.com/${number}`)
                .then(res => res.text())
                .catch((err) => {
                    Logger.error(err);
                    const randomanswers = [
                        "is a boring number.",
                        "is a number for which we're missing a fact (submit one to numbersapi at google mail!).",
                        "is an uninteresting number.",
                        "is an unremarkable number."
                    ];
                    return number + randomanswers[random(0, randomanswers.length)];
                });
            
            interaction.editReply({
                content: null,
                embeds: [embedBuilder(result).setFooter(embedFooter)]
            });
            return;
        }
    }
}
