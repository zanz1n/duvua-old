import { Events } from "discord.js"

export type EventBase = {
    name: Events
    enabled: boolean
    // eslint-disable-next-line @typescript-eslint/ban-types
    run: (...args: any) => Promise<void>
}
