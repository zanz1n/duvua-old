import { Interaction } from "discord.js";
import { IEvent, NextFunction } from "../../lib/types/EventBase.js";
import { Event } from "../../lib/decorators/Event.js";
import { Logger } from "../../lib/Logger.js";

@Event({
    name: "interactionCreate"
})
export default class implements IEvent {
    private logger = new Logger("InteractionManager");
    
    async run(interaction: Interaction, next: NextFunction<"interactionCreate">) {
        const interactionType = interaction.type == 2 ? "Command" : interaction.type == 3 ? "Button" : "Unknown";
        const startDate = Date.now();
        next(interaction).finally(() => {
            this.logger.info(interactionType +
                ` ${interaction.isCommand() ? interaction.commandName : interaction["customId"]}` +
                " -> " +
                interaction.guild?.name +
                ` - ${Date.now() - startDate}ms`
            );
        });
    }
}
