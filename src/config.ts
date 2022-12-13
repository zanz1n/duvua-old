export const config = new (class {
    embedColor = 0xff21f4
    token = process.env.DISCORD_TOKEN ?? ""
    debugMode = process.env.BOT_DEBUG_MODE == "true" ?? false
    postCommands = process.argv.find(arg =>
        arg.toLowerCase().startsWith("--post-slash-commands="))
        ?.replace("--post-slash-commands=", "") == "true" ?? false

    redis = {
        host: process.env.F_REDIS_HOST ?? "redisdb",
        port: Number(process.env.F_REDIS_PORT) ?? 6379,
        password: process.env.F_REDIS_PASSWORD ?? ""
    }

    lavalink = {
        host: process.env.LAVALINK_HOST ?? "lavalink",
        port: Number(process.env.LAVALINK_PORT) ?? 2333,
        password: process.env.LAVALINK_PASSWORD ?? "",
    }
})
