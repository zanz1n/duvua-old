import { Events, GuildMember, Interaction } from "discord.js"
import { Duvua } from "../Client"
import { EventBase } from "../types/eventBase"
import { sInteraction } from "../types/discord/sInteraction"
import { logger } from "../modules/logger"
import { config } from "../config"

export const event: EventBase = {
    name: Events.InteractionCreate,
    enabled: true,

    async run(interaction: Interaction, client: Duvua) {
        if (interaction.isCommand()) {
            let dateStart: number | null = null
            // eslint-disable-next-line no-var
            if (config.debugMode) dateStart = Date.now()
            if (!(interaction.member instanceof GuildMember)) return
    
            const cmd = client.commands.get(interaction.commandName)
            if (!cmd) return
    
            if (cmd.needsDefer) await interaction.deferReply({ ephemeral: cmd.ephemeral })
    
            await cmd.run({ interaction: interaction as sInteraction, client }).catch(e => logger.error(e))

            if (config.debugMode && dateStart) logger.debug(`[commandTimer] - ${cmd.data.name}: ${Date.now() - dateStart}ms`)
        }
    }
}
