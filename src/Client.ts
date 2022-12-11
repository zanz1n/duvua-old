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
import { Node } from "lavaclient"
import { eventsData } from "./modules/loadEvents"
import { CommandBase } from "./types/commandBase"
import { Kitsu } from "./modules/kitsu.io/index"
import { Translator } from "./modules/translator/index"

export class Duvua extends Client {
    commands: Collection<string, CommandBase> = commandsData

    events: EventBase[]

    music: Node

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

        this.music = new Node({
            connection: {
                host: config.lavalink.host,
                password: config.lavalink.password,
                port: config.lavalink.port
            },
            sendGatewayPayload: (id, payload) => this.guilds.cache.get(id)?.shard.send(payload)
        })
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
        this.ws.on(GatewayDispatchEvents.VoiceServerUpdate, data => this.music.handleVoiceUpdate(data))
        this.ws.on(GatewayDispatchEvents.VoiceStateUpdate, data => this.music.handleVoiceUpdate(data))
    }
}
