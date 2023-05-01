package studio.izan.duvua.music
import studio.izan.duvua.music.types.PostgresOptions

object Main {
    private lateinit var token: String
    private lateinit var postgresHost: String
    private lateinit var postgresUsername: String
    private lateinit var postgresPassword: String
    private lateinit var postgresDatabase: String
    private var postgresMaxPoolSize: String? = null

    private fun getRequiredParamFromEnv(
        args: Array<String>,
        argPrefix: String,
        environmentVar: String): String {
        var varL = args.find { arg -> arg.startsWith("--$argPrefix=") }
            ?.replace("--$argPrefix=", "")

        if (varL == null) {
            varL = System.getenv(environmentVar)
            if (varL == null) {
                throw Error("One required option was not provided: --$argPrefix or env $environmentVar")
            }
        }
        return varL
    }

    private fun getOptionalParamFromEnv(
        args: Array<String>,
        argPrefix: String,
        environmentVar: String): String? {
        var varL = args.find { arg -> arg.startsWith(argPrefix) }
            ?.replace(argPrefix, "")
        if (varL == null) varL = System.getenv(environmentVar)

        return varL
    }

    private fun loadOptions(args: Array<String>) {
        token = getRequiredParamFromEnv(args, "token", "DISCORD_TOKEN")
        postgresHost = getRequiredParamFromEnv(args, "postgres-host", "DATABASE_HOST")
        postgresUsername = getRequiredParamFromEnv(args, "postgres-username", "POSTGRES_USER")
        postgresPassword = getRequiredParamFromEnv(args, "postgres-password", "POSTGRES_PASSWORD")
        postgresDatabase = getRequiredParamFromEnv(args, "database-name", "POSTGRES_DB")
        postgresMaxPoolSize =
            getOptionalParamFromEnv(args, "postgres-max-pool-size", "POSTGRES_MAX_POOL_SIZE")
    }

    @JvmStatic
    fun main(args: Array<String>) {
        loadOptions(args)
        DuvuaMusic(this.token, object : PostgresOptions {
            override val databaseName = postgresDatabase
            override val username = postgresUsername
            override val host = postgresHost
            override val password = postgresPassword
            override val maxPoolSize = postgresMaxPoolSize?.toInt()
        }).run()
    }
}