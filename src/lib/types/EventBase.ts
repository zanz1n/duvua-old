import { ClientEvents } from "discord.js";

export type NextFunction<K extends keyof ClientEvents> = (...args: ClientEvents[K]) => Promise<unknown>;

export interface IEvent {
    run: (...args: any[]) => Promise<unknown>;
}

export interface EventBaseOpts {
    name: keyof ClientEvents;
}

export interface StoredEvent extends IEvent, EventBaseOpts {}
