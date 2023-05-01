import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    GuildMember,
    ImageURLOptions
} from "discord.js";
import { Command } from "../../lib/decorators/Command.js";
import { CommandBaseCategory, CommandBaseRunOpts, ICommand } from "../../lib/types/CommandBase.js";

@Command({
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
    needsDefer: false
})
export default class implements ICommand<false> {
    async run({ interaction }: CommandBaseRunOpts<false>) {
        const user = interaction.options.getUser("user") ?? interaction.user;
        const member = interaction.options.getMember("member") ?? interaction.member;

        const staticOpts = {
            size: 128,
            forceStatic: true,
            extension: "webp"
        } satisfies ImageURLOptions;
        
        let avatar: string, avatarTiny: string, name: string;
        
        const embed = new EmbedBuilder()
            .setFooter({
                text: `Pedido por ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(staticOpts)
            });
        
        const row = new ActionRowBuilder<ButtonBuilder>();
        
        if (member && member instanceof GuildMember) {
            avatar = member.displayAvatarURL({ size: 512 });
            avatarTiny = member.displayAvatarURL(staticOpts);
            if (member.nickname) name = member.nickname;
        }

        avatar ??= user.displayAvatarURL({ size: 512 });
        avatarTiny ??= user.displayAvatarURL(staticOpts);
        name ??= user.username;

        embed.setAuthor({
            name: `Avatar de ${name}`,
            iconURL: avatarTiny
        });

        embed.setImage(avatar);

        row.addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("Ver original")
                .setEmoji("🔗")
                .setURL(avatar)
        );

        await interaction.reply({
            components: [row],
            embeds: [embed]
        });
    }
}
