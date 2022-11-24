import { Duvua } from "./Client";
import { config } from "./config";

const TOKEN = config.token

if (!TOKEN || TOKEN.length < 10) {
    console.error("NO VALID TOKEN PROVIDED\nGOT VALUE \"" + TOKEN + "\"")
    process.exit(1)
}

new Duvua(TOKEN)