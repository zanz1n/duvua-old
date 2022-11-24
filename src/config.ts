export const config = new (class {
    embedColor = 0xff21f4
    token = process.env.DISCORD_TOKEN ?? ""
    postCommands = process.argv.find(arg =>
        arg.toLowerCase().startsWith("--post-slash-commands="))
        ?.replace("--post-slash-commands=", "") == "true" ?? false

    redis = {
        host: process.env.F_REDIS_HOST ?? "redisdb",
        port: Number(process.env.F_REDIS_PORT) ?? 6379,
        password: process.env.F_REDIS_PASSWORD ?? ""
    }
})
