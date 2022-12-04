import { TextBasedChannel } from "discord.js"

declare module "@lavaclient/queue" {
    interface Queue {
        channel: TextBasedChannel
    }
}
