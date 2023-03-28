declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: "development" | "production" | "test";
        LOG_LEVEL: "DEBUG" | "INFO" | "WARN" | "ERROR";
        DISCORD_TOKEN: string;
    }
}
