import {
    Client,
    Collection,
    Events,
    GatewayDispatchEvents,
    GatewayIntentBits,
    Options
} from "discord.js"
import { EventBase } from "./types/eventBase"
import { commands as commandsData } from "./modules/loadCommandsData"
import { Dba } from "./db"
import { sEmbed } from "./types/discord/sEmbed"

import { RedisClient } from "./redis"
import { config } from "./config"
import { eventsData } from "./modules/loadEvents"
import { CommandBase } from "./types/commandBase"
import { Kitsu } from "./modules/kitsu.io/index"
import { Translator } from "./modules/translator/index"
import { Shoukaku, Connectors } from "shoukaku"
import { logger } from "./modules/logger"

export class Duvua extends Client {
    commands: Collection<string, CommandBase> = commandsData

    events: EventBase[]

    music: Shoukaku

    dba: Dba

    redis: RedisClient

    translator: Translator

    kitsu: Kitsu
    
    staticHelpEmbed?: sEmbed

    private _token: string

    constructor(token: string) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildVoiceStates
            ],
            sweepers: {
                ...Options.DefaultSweeperSettings
            },
            makeCache: Options.cacheWithLimits({
                ...Options.DefaultMakeCacheSettings,
            })
        })

        this.translator = new Translator()
        this.events = eventsData
        this.dba = new Dba()
        this.redis = new RedisClient()

        this.music = new Shoukaku(new Connectors.DiscordJS(this), [
            {
                name: "LocalNode",
                url: `${config.lavalink.host}:${config.lavalink.port.toString()}`,
                auth: config.lavalink.password
            }
        ])
        this._token = token
        this.kitsu = new Kitsu(this.redis, this.translator)
        this.init()
    }

    async init() {
        this.login(this._token)
        this.listenForEvents()
    }

    async listenForEvents() {
        for (const event of this.events) {
            if (event.name == Events.InteractionCreate) this.on(event.name, async (interaction) => event.run(interaction, this))
            else if (event.name == Events.ClientReady) this.on(event.name, async () => event.run(this))
        }
        this.music.on("error", (name, error) => logger.error(`Lavalink ${error.name} error on ${name} - ${error.message}`))
        this.music.on("ready", (name, reconnected) => { logger.info(`Lavalink Node ${name} - connected: ${reconnected}`) })
    }
}
