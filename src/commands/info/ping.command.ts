import { CommandBaseCategory, CommandBaseRunOpts, ICommand } from "../../lib/types/CommandBase.js";
import { Command } from "../../lib/decorators/Command.js";

@Command({
    data: {
        name: "ping",
        description: "Mostra o ping do bot e responde com pong",
        descriptionLocalizations: { "en-US": "Shows the bot ping and replies with pong" }
    },
    enabled: true,
    ephemeral: true,
    needsDefer: false,
    category: CommandBaseCategory.INFO
})
export default class implements ICommand<false> {
    async run({ interaction, client }: CommandBaseRunOpts<false>) {
        await interaction.reply(`🏓 **Pong!**\n📡 Ping do bot: ${client.ws.ping}ms`);
    }
}
