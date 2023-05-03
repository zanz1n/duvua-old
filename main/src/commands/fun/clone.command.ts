import {
    ApplicationCommandOptionType,
    ChannelType,
    GuildMember,
    ImageURLOptions
} from "discord.js";
import { Command } from "../../lib/decorators/Command.js";
import { CommandBaseCategory, CommandBaseRunOpts, ICommand } from "../../lib/types/CommandBase.js";
import { embed as embedBuilder } from "../../utils/Embed.js";
import { men } from "../../utils/mention.js";
import { sleep } from "../../utils/lang.js";

@Command({
    data: {
        name: "clone",
        description: "Cria um clone de alguém",
        descriptionLocalizations: { "en-US": "Create a clone of someone" },
        options: [
            {
                name: "user",
                description: "Quem você deseja fazer o clone",
                descriptionLocalizations: { "en-US": "Who wou want to clone" },
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: "message",
                description: "O que você deseja fazer o usuário enviar no canal de texto",
                descriptionLocalizations: { "en-US": "What you want the clone to say" },
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    enabled: true,
    ephemeral: true,
    category: CommandBaseCategory.FUN,
    needsDefer: true
})
export default class implements ICommand<true> {
    async run({ interaction }: CommandBaseRunOpts<true>) {
        const user = interaction.options.getUser("user", true);
        const member = interaction.options.getMember("user");

        if (!member || !(member instanceof GuildMember)) return;
        if (!interaction.channel || !(interaction.channel.type == ChannelType.GuildText)) return;

        const message = interaction.options.getString("message", true);

        const options: ImageURLOptions = {
            forceStatic: true,
        };

        const avatar = member.displayAvatarURL(options) ?? user.displayAvatarURL(options);
        const name = member.nickname ?? user.username;

        interaction.channel.createWebhook({ name, avatar, reason: "Clone command" })
            .then(async(webhook) => {
                webhook.send(message);
                sleep(10000).then(() => webhook.delete());
            });

        const embed = embedBuilder(`O webhhok foi criado, ${men(interaction.user)}`);
        interaction.editReply({ content: null, embeds: [embed] });
    }
}
