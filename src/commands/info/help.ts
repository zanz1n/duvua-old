import { ApplicationCommandOptionType, ButtonStyle, ComponentType } from "discord.js"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"
import { sMessageButton } from "../../types/discord/sMessageButton"
import { sButtonActionRow } from "../../types/discord/sMessageActionRow"

const loadFromCommand = (command: CommandBase, helpEmbed: sEmbed) => {
    if (command.data.options && command.data.options[0].type == ApplicationCommandOptionType.SubcommandGroup) {
        command.data.options.forEach(subCmdGrpOpt => {
            if (subCmdGrpOpt.type != ApplicationCommandOptionType.SubcommandGroup)
                throw new Error("Command data probably invalid")
            if (subCmdGrpOpt.options && subCmdGrpOpt.options[0].type == ApplicationCommandOptionType.Subcommand) {
                subCmdGrpOpt.options.forEach(subCmdOpt => {
                    helpEmbed.addFields({
                        name: command.data.name +" "+ subCmdGrpOpt.name +" "+ subCmdOpt.name,
                        value: subCmdOpt.description,
                        inline: true
                    })
                })
            }
        })
    }
    else if (command.data.options && command.data.options[0].type == ApplicationCommandOptionType.Subcommand) {
        command.data.options.forEach(subCmdOpt => {
            helpEmbed.addFields({
                name: command.data.name +" "+ subCmdOpt.name,
                value: subCmdOpt.description,
                inline: true
            })
        })
    } else helpEmbed.addFields({
        name: command.data.name,
        value: command.data.description,
        inline: true
    })
}

type embedsCacheType = {
    index: sEmbed
    FUN: sEmbed
    INFO: sEmbed
    MODUTIL: sEmbed
    MUSIC: sEmbed
    MONEYLEVEL: sEmbed
}

export const command: CommandBase = {
    data: {
        name: "help",
        description: "Mostra todos os comandos do bot e suas funções",
        descriptionLocalizations: { "en-US": "Shows all the commands of the bot and their functionalities" }
    },
    enabled: true,
    ephemeral: false,
    needsDefer: true,
    category: CommandBaseCategory.INFO,

    async run({interaction, client}) {
        if (!interaction.guild) return
        if (!interaction.channel) return

        const dateNow = Date.now()

        let embeds: embedsCacheType

        const embedsCache = await client.redis.get("help-embed-data-pt_BR")

        if (!embedsCache) {
            embeds = {
                index: new sEmbed().setTitle("Help")
                    .setDescription(`
        **${client.user} pode fazer muitas coisas para o seu servidor.**
        O que inclui tocar músicas, ver avatar de usuários, beijar alguém e até fazer um meme, confira todos os comandos do bot abaixo:\n
        **:globe_with_meridians: - slash commands | :m: - legacy commands**\n
        :globe_with_meridians: - digite:  **/**  para ver as opções; :m: - podem ser usados com o prefixo escolhido no chat (padrão "-")`)

                    .addFields([{ name: "ℹ️ Categorias", value:"**Para visualizar todas as categorias e comandos use a caixa de seleção abaixo.**"}])

                    .setThumbnail(client.user?.displayAvatarURL() ?? "")

                    .setFooter({ text: `Requisitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() }).setTimestamp(),

                FUN: new sEmbed().setTitle("🥳 Fun").setDescription("Comandos para descontrair"),
                INFO: new sEmbed().setTitle("ℹ️ Info").setDescription("Comandos para ver informações uteis"),
                MODUTIL: new sEmbed().setTitle("🖋️ Moderation / Utility").setDescription("Comandos para auxiliar na moderação e organização do server"),
                MUSIC: new sEmbed().setTitle("🎧 Music").setDescription("Comandos para tocar músicas na call"),
                MONEYLEVEL: new sEmbed().setTitle("💸 Money / Level").setDescription("Comandos relacionados ao sistema monetário e de ranks do bot")
            }

            client.commands.forEach((command) => {
                if (command.category == CommandBaseCategory.FUN) {
                    loadFromCommand(command, embeds.FUN)
                }
                if (command.category == CommandBaseCategory.INFO) {
                    loadFromCommand(command, embeds.INFO)
                }
                if (command.category == CommandBaseCategory.MODUTIL) {
                    loadFromCommand(command, embeds.MODUTIL)
                }
                if (command.category == CommandBaseCategory.MONEYLEVEL) {
                    loadFromCommand(command, embeds.MONEYLEVEL)
                }
                if (command.category == CommandBaseCategory.MUSIC) {
                    loadFromCommand(command, embeds.MUSIC)
                }
            })
        }
        else {
            embeds = JSON.parse(embedsCache) as embedsCacheType
        }

        const buttons = {
            FUN: new sMessageButton()
                .setCustomId(`fun${dateNow}`)
                .setLabel("Fun")
                .setEmoji("🥳")
                .setStyle(ButtonStyle.Secondary),

            INFO: new sMessageButton()
                .setCustomId(`info${dateNow}`)
                .setLabel("Info")
                .setEmoji("ℹ️")
                .setStyle(ButtonStyle.Secondary),

            MODUTIL: new sMessageButton()
                .setCustomId(`mod-util${dateNow}`)
                .setLabel("Moderation / Utility")
                .setEmoji("🖋️")
                .setStyle(ButtonStyle.Secondary),
                
            MUSIC: new sMessageButton()
                .setCustomId(`music${dateNow}`)
                .setLabel("Music")
                .setEmoji("🎧")
                .setStyle(ButtonStyle.Secondary),

            MONEYLEVEL: new sMessageButton()
                .setCustomId(`money${dateNow}`)
                .setLabel("Money / Level")
                .setEmoji("💸")
                .setStyle(ButtonStyle.Secondary)
        }

        const row = new sButtonActionRow()
            .addComponents(buttons.FUN, buttons.INFO, buttons.MODUTIL, buttons.MUSIC, buttons.MONEYLEVEL)

        const collector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: (slint) => slint.user.id == interaction.user.id,
            time: 60000
        })

        collector.on("collect", async (i) => {
            switch (i.customId) {
            case `fun${dateNow}`:
                i.deferUpdate()
                interaction.editReply({ embeds: [embeds.FUN] })
                break
            case `info${dateNow}`:
                i.deferUpdate()
                interaction.editReply({ embeds: [embeds.INFO] })
                break
            case `mod-util${dateNow}`:
                i.deferUpdate()
                interaction.editReply({ embeds: [embeds.MODUTIL] })
                break
            case `music${dateNow}`:
                i.deferUpdate()
                interaction.editReply({ embeds: [embeds.MUSIC] })
                break
            case `money${dateNow}`:
                i.deferUpdate()
                interaction.editReply({ embeds: [embeds.MONEYLEVEL] })
                break
            }
        })

        collector.on("end", () => {
            buttons.FUN.setDisabled(true)
            buttons.INFO.setDisabled(true)
            buttons.MODUTIL.setDisabled(true)
            buttons.MONEYLEVEL.setDisabled(true)
            buttons.MUSIC.setDisabled(true)

            interaction.editReply({ components: [row] })
        })

        interaction.editReply({
            content: null,
            embeds: [embeds.index],
            components: [row]
        })

        client.redis.set("help-embed-data-pt_BR", JSON.stringify(embeds))
    }
}
