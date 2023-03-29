import chalk from "chalk";

import debug from "debug";

function getTimestamp() {
    const date = new Date();
    const seconds = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
    return `${chalk.gray(process.pid)} - ` +
        `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ` +
        `${date.getHours()}:${date.getMinutes()}:${seconds}`;
}

console.log = (...message: unknown[]) => {
    debug("bot")(
        getTimestamp() + "\t" +
        chalk.cyan("INFO") + "\t",
        ...message
    );
};

console.warn = (...message: unknown[]) => {
    debug("bot")(
        getTimestamp() + "\t" +
        chalk.yellow("WARN") + "\t",
        ...message
    );
};

console.debug = (...message: unknown[]) => {
    debug("bot")(
        getTimestamp() + "\t" +
        chalk.magenta("DEBUG") + "\t",
        "",
        ...message
    );
};

console.error = (...message: unknown[]) => {
    debug("bot")(
        getTimestamp() + "\t" +
        chalk.red("ERROR") + "\t",
        ...message
    );
};

export class Logger {
    ctx: string;

    constructor(ctx: string) {
        this.ctx = chalk.yellow(`[${ctx}]`);
    }

    static info(...message: unknown[]) {
        debug("bot")(
            getTimestamp() + "\t" +
            chalk.cyan("INFO"),
            ...message
        );
    }

    static error(...message: unknown[]) {
        debug("bot")(
            getTimestamp() + "\t" +
            chalk.red("ERROR"),
            ...message
        );
    }

    static debug(...message: unknown[]) {
        debug("bot")(
            getTimestamp() + "\t" +
            chalk.magenta("DEBUG"),
            ...message
        );
    }

    static warn(...message: unknown[]) {
        debug("bot")(
            getTimestamp() + "\t" +
            chalk.yellow("WARN"),
            ...message
        );
    }

    info(...message: unknown[]) {
        debug("bot")(
            getTimestamp() + "\t" +
            chalk.cyan("INFO"),
            this.ctx,
            ...message
        );
    }

    error(...message: unknown[]) {
        debug("bot")(
            getTimestamp() + "\t" +
            chalk.red("ERROR"),
            this.ctx,
            ...message
        );
    }

    debug(...message: unknown[]) {
        debug("bot")(
            getTimestamp() + "\t" +
            chalk.magenta("DEBUG"),
            this.ctx,
            ...message
        );
    }

    warn(...message: unknown[]) {
        debug("bot")(
            getTimestamp() + "\t" +
            chalk.yellow("WARN"),
            this.ctx,
            ...message
        );
    }
}
