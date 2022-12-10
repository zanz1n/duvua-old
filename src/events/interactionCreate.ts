import { Events, GuildMember, Interaction } from "discord.js"
import { Duvua } from "../Client"
import { EventBase } from "../types/eventBase"
import { sInteraction } from "../types/discord/sInteraction"
import { logger } from "../modules/logger"

export const event: EventBase = {
    name: Events.InteractionCreate,
    enabled: true,

    async run(interaction: Interaction, client: Duvua) {
        if (interaction.isCommand()) {
            const dateStart = Date.now()
            if (!(interaction.member instanceof GuildMember)) return

            // if (interaction.member instanceof GuildMember) client.dba.member.getOrCreateFromMember(interaction.member)
            // if (interaction.guild) client.dba.guild.getOrCreateFromGuild(interaction.guild)
            // client.dba.user.getOrCreateFromUser(interaction.user)
    
            const cmd = client.commands.get(interaction.commandName)
            if (!cmd) return
    
            if (cmd.needsDefer) await interaction.deferReply({ ephemeral: cmd.ephemeral })
    
            await cmd.run({ interaction: interaction as sInteraction, client }).catch(e => logger.error(e))
            logger.debug(`[commandTimer] - ${cmd.data.name}: ${Date.now() - dateStart}ms`)
        }
    }
}
