import { ChatInputApplicationCommandData, ChatInputCommandInteraction } from "discord.js";
import { Client } from "../Client.js";

export interface CommandBaseInteraction<Defered extends boolean> extends ChatInputCommandInteraction {
    defered: Defered
}

export enum CommandBaseCategory {
    FUN = "FUN",
    INFO = "INFO",
    MODUTIL = "MODUTIL",
    MUSIC = "MUSIC",
    MONEYLEVEL = "MONEYLEVEL"
}

export interface CommandBaseRunOpts<Defered extends boolean> {
    interaction: CommandBaseInteraction<Defered>;
    client: Client<true>
}

export interface CommandBaseOpts {
    ephemeral: boolean
    enabled: boolean
    data: ChatInputApplicationCommandData
    needsDefer: boolean
    category: CommandBaseCategory
}

export interface ICommand<Defered extends boolean> {
    run: (args: CommandBaseRunOpts<Defered>) => Promise<unknown>;
}

export interface StoredCommand extends CommandBaseOpts, ICommand<boolean> { }
