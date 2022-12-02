import debug from "debug"
// type logTypes =
//     "debug"
//     | "info"
//     | "warn"
//     | "error"
//     | "log"

export const logger = {
    // debug(log: string | any) { debug("bot:debug")(`\x1b[42mDEBUG\x1b[0m` + ` ${log}`) },
    // info(log: string | any) { debug("bot:info")(`\x1b[44mINFO\x1b[0m` + ` ${log}`) },
    // warn(log: string | any) { debug("bot:warn")(`\x1b[43mWARN\x1b[0m` + ` ${log}`) },
    // error(log: string | any) { debug("bot:error")(`\x1b[41mERROR\x1b[0m` + ` ${log}`) },
    debug:  debug("bot:debug"),
    info:   debug("bot:info" ),
    warn:   debug("bot:warn" ),
    error:  debug("bot:error")
}
