if (process.env.NODE_ENV !== "production") await import("dotenv/config");

import "reflect-metadata";
import { Client } from "./lib/Client.js";
import url from "url";
import { join } from "path";
import debug from "debug";
debug.enable("bot");

const __dirname = join(url.fileURLToPath(new URL(".", import.meta.url)));

if (!process.env.DISCORD_TOKEN) throw new Error("No token provided");

const client = Client.createDefault(process.env.DISCORD_TOKEN);

client.forRootWiring(__dirname);

client.autowireEvents();
client.autowireCommands();

client.login();
