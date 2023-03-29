import { Interaction } from "discord.js";
import { IEvent, NextFunction } from "../../lib/types/EventBase.js";
import { Event } from "../../lib/decorators/Event.js";

@Event({
    name: "interactionCreate"
})
export default class implements IEvent {
    async run(interaction: Interaction, next: NextFunction<"interactionCreate">) {
        next(interaction);
    }
}
