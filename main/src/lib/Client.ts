import {
    Client as BaseClient,
    BitFieldResolvable,
    ClientOptions,
    Collection,
    GatewayIntentBits,
    GatewayIntentsString,
    Interaction,
    REST,
    Routes
} from "discord.js";
import { CommandBaseInteraction, StoredCommand } from "./types/CommandBase.js";
import { BaseClientEvents, ListenerCallback } from "./types/Client.js";
import { Logger as BaseLogger } from "./Logger.js";
import { InvalidNamespaceError } from "./errors/InvalidNamespaceError.js";
import { join } from "path";
import { readdirSync } from "fs";
import chalk from "chalk";
import { container } from "tsyringe";

const Logger = new BaseLogger("Client");

export class Client<Ready extends boolean = boolean> extends BaseClient<Ready> {
    public on<K extends keyof BaseClientEvents>(event: K, listener: ListenerCallback<K>) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return super.on(event, listener);
    }

    public emit<K extends keyof BaseClientEvents>(event: K, ...args: BaseClientEvents[K]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return super.emit(event, ...args);
    }

    public commands = new Collection<string, StoredCommand>();

    private _token: string;
    private _postCommandsOnReady = false;

    private dirname = "";

    public forRootWiring(dir: string) { this.dirname = dir; }

    public static createDefault(token: string, intents?: BitFieldResolvable<GatewayIntentsString, number>) {
        return new Client({
            intents: intents ?? [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.AutoModerationConfiguration,
                GatewayIntentBits.AutoModerationExecution,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent
            ],
            token,
        });
    }

    private constructor(options: ClientOptions & { token: string }) {
        super(options);
        this._token = options.token;
    }

    public login() {
        this.selfListenEvents();
        return super.login(this._token);
    }

    public postCommandsOnReady() {
        this._postCommandsOnReady = true;
    }

    private interactionLogger = new BaseLogger("InteractionManager");

    private async postCommands() {
        const rest = new REST({ version: "10" }).setToken(this._token);

        const data = this.commands.map(cmd => cmd.data);

        rest.put(Routes.applicationCommands((this as Client<true>).application.id), {
            body: data
        }).then(() => {
            Logger.info("Commands posted");
        }).catch((err) => {
            Logger.error(err);
        });
    }

    private nextS = {
        "interactionCreate": async(interaction: Interaction) => {

            if (interaction.isChatInputCommand()) {
                const cmd = this.commands.get(interaction.commandName);
                if (cmd && cmd.enabled) {
                    if (cmd.needsDefer) await interaction.deferReply();
                    try {
                        await cmd.run({ client: this, interaction: interaction as CommandBaseInteraction<boolean> });
                    } catch(err) {
                        this.interactionLogger.error(err);
                    }
                }
            }
        },
        "ready": async(c: Client<true>) => {
            Logger.info("Logged in as " + c.user.tag);
            if (this._postCommandsOnReady) this.postCommands();
        }
    };

    private async selfListenEvents() {
        this.on("autowiredCommand", (cmd) => {
            Logger.info(`Autowired command { ${cmd.category} ${cmd.data.name} }`);
            this.commands.set(cmd.data.name, cmd);
        });
        this.on("autowiredEvent", (evt) => {
            Logger.info(`Autowired event { ${evt.name} }`);
            if (evt.name in this.nextS) {
                this.on(evt.name, (...args) => {
                    evt.run(...args, this.nextS[evt.name]);
                });
            }
        });
    }

    private validateNamespace(type: string, namespace: unknown): boolean {
        if (type == "command") return this.validateNamespace__command(namespace);
        else if (type == "event") return this.validateNamespace__event(namespace);
        else throw new InvalidNamespaceError(type);
    }

    private validateNamespace__command(cmd: unknown): boolean {
        if (cmd) {
            return (
                typeof cmd == "object" &&
                typeof cmd["category"] == "string" &&
                typeof cmd["enabled"] == "boolean" &&
                typeof cmd["ephemeral"] == "boolean" &&
                typeof cmd["needsDefer"] == "boolean" &&
                typeof cmd["data"] == "object" &&
                typeof cmd["run"] == "function"
            );
        }
        else { return false; }
    }

    private validateNamespace__event(cmd: unknown): boolean {
        if (cmd) {
            return (
                typeof cmd == "object" &&
                typeof cmd["name"] == "string" &&
                typeof cmd["run"] == "function"
            );
        }
        else { return false; }
    }

    private autowireSomething(wireType: "command" | "event" | "genericInteraction", wireDir: string) {
        const wiredAbsolutePath = join(this.dirname, wireDir);

        Logger.info(`Autowiring ${wireType}s from ${wireDir}`);

        const wiredGroups = readdirSync(wiredAbsolutePath);

        wiredGroups.forEach(wiredGroup => {
            const wiredInGroup = readdirSync(join(wiredAbsolutePath, wiredGroup))
                .filter(cmd =>
                    cmd.endsWith(`.${wireType}.ts`) || cmd.endsWith(`.${wireType}.js`)
                );

            wiredInGroup.forEach(async wiredInGroup => {
                const wiredFile = join(wiredAbsolutePath, wiredGroup, wiredInGroup);

                try {
                    const wired = await import(wiredFile);

                    
                    if (!wired.default)
                        throw new InvalidNamespaceError(`Invalid ${wireType} namespace format, make sure to export the props properly`);

                    const wiredModuleRaw = container.resolve<any>(wired.default);

                    const wiredModule = {
                        ...Reflect.getMetadata(`${wireType}:data`, wired.default)
                    };

                    for (const iti in wiredModuleRaw) {
                        wiredModule[iti] = wiredModuleRaw[iti];
                    }

                    wiredModule["run"] = wiredModuleRaw["run"];

                    if (this.validateNamespace(wireType, wiredModule)) {
                        if (wireType == "command") {
                            this.emit("autowiredCommand", wiredModule);
                        }
                        if (wireType == "event") {
                            this.emit("autowiredEvent", wiredModule);
                        }
                    }
                    else throw new InvalidNamespaceError(`Invalid ${wireType} namespace format, make sure to export the props properly`);
                } catch(err) {
                    Logger.error(
                        chalk.bgRed(`Error while autowiring ${wireType} from ${wiredFile.replace(wiredAbsolutePath + "/", "")}\n\t`)
                        +
                        chalk.red(
                            `${err.name}: ${err.message}\n\t` +
                            "The module may not be exported properly or contain an error"
                        )
                    );
                }
            });
        });
    }

    public autowireCommands(commandsDir = "./commands") {
        const result = this.autowireSomething("command", commandsDir);
        return result;
    }

    public autowireEvents(eventDir = "./events") {
        return this.autowireSomething("event", eventDir);
    }

    public autowireInteractions(interactionDir = "./interactions") {
        return this.autowireSomething("genericInteraction", interactionDir);
    }
}
