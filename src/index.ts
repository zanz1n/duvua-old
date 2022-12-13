import { Duvua } from "./Client"
import { config } from "./config"

const { token } = config

if (!token || token.length < 10) {
    throw new Error("NO VALID TOKEN PROVIDED\nGOT VALUE \"" + token + "\"")
}

const bot = new Duvua()

bot.login(token)
