import { Awaitable, ClientEvents } from "discord.js";
import { StoredCommand } from "./CommandBase.js";
import { StoredEvent } from "./EventBase.js";

export interface BaseClientEvents extends ClientEvents {
    autowiredCommand: [data: StoredCommand];
    autowiredEvent: [data: StoredEvent]
}

export type ListenerCallback<K extends keyof BaseClientEvents> = (...args: BaseClientEvents[K]) => Awaitable<void>
