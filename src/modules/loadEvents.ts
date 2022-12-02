import { readdirSync } from "fs"
import path from "path"
import { EventBase } from "../types/eventBase"
import { logger } from "./logger"

function loadEvents() {
    logger.info("Loading events in /events")
    const events: EventBase[] = []

    const eventsPath = path.join(__dirname, "..", "events")
    const eventFiles = readdirSync(eventsPath)
        .filter(file => file.endsWith(".ts") || file.endsWith(".js"))
    for (const event of eventFiles) {
        
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const evtRaw = require(`${eventsPath}/${event}`)
        if ("event" in evtRaw) {
            const evt = evtRaw.event as EventBase
            logger.debug(`Event ${evt.name}`)
            events.push(evt)
        }
    }
    return events
}

export const eventsData = loadEvents()
