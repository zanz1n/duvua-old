import { Client, GatewayIntentBits } from "discord.js"
import { CommandBase } from "./types/commandBase"
import { eventBase } from "./types/eventBase"
import { commands as commandsData } from "./modules/loadCommandsData"
import { Dba } from "./db"
import { sEmbed } from "./types/discord/sEmbed"

import { event as interactionCreateEvent } from "./events/interactionCreate"
import { event as readyEvent } from "./events/ready"
import { redisClient } from "./redis"

export class Duvua extends Client {
    commands: CommandBase[] = []
    events: eventBase[] = []

    dba = new Dba

    redis = redisClient
    
    staticHelpEmbed?: sEmbed

    private _token: string

    constructor(token: string) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildBans
            ]
        })
        this._token = token
        this.init()
    }

    async init() {
        this.commands = commandsData
        this.loadEvents()
        this.login(this._token)
    }

    async loadEvents() {
        this.on(interactionCreateEvent.name, async (interatction) => {
            await interactionCreateEvent.run(interatction, this)
        })
        this.on(readyEvent.name, async () => {
            await readyEvent.run(this)
        })
    }

    random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)
}