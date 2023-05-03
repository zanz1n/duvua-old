import {
    ApplicationCommandOptionType,
    ChatInputApplicationCommandData,
    EmbedBuilder
} from "discord.js";

export const loadFromCommand = (command: ChatInputApplicationCommandData, helpEmbed: EmbedBuilder) => {
    if (command.options && command.options[0].type == ApplicationCommandOptionType.SubcommandGroup) {
        command.options.forEach(subCmdGrpOpt => {
            if (subCmdGrpOpt.type != ApplicationCommandOptionType.SubcommandGroup)
                throw new Error("Command data probably invalid");
            if (subCmdGrpOpt.options && subCmdGrpOpt.options[0].type == ApplicationCommandOptionType.Subcommand) {
                subCmdGrpOpt.options.forEach(subCmdOpt => {
                    helpEmbed.addFields({
                        name: command.name +" "+ subCmdGrpOpt.name +" "+ subCmdOpt.name,
                        value: subCmdOpt.description,
                        inline: true
                    });
                });
            }
        });
    }
    else if (command.options && command.options[0].type == ApplicationCommandOptionType.Subcommand) {
        command.options.forEach(subCmdOpt => {
            helpEmbed.addFields({
                name: command.name +" "+ subCmdOpt.name,
                value: subCmdOpt.description,
                inline: true
            });
        });
    } else helpEmbed.addFields({
        name: command.name,
        value: command.description,
        inline: true
    });
};

export interface EmbedsCacheType {
    index: EmbedBuilder
    FUN: EmbedBuilder
    INFO: EmbedBuilder
    MODUTIL: EmbedBuilder
    MUSIC: EmbedBuilder
    MONEYLEVEL: EmbedBuilder
}
