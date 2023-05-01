import { Event } from "../../lib/decorators/Event.js";
import { Client } from "../../lib/Client.js";
import { IEvent, NextFunction } from "../../lib/types/EventBase.js";

@Event({
    name: "ready",
})
export default class implements IEvent {
    async run(client: Client<true>, next: NextFunction<"ready">) {
        next(client);
    }
}
