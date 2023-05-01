package studio.izan.duvua.music

import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.JDABuilder
import net.dv8tion.jda.api.hooks.ListenerAdapter
import net.dv8tion.jda.api.utils.cache.CacheFlag
import studio.izan.duvua.music.dba.PostgresProvider
import studio.izan.duvua.music.events.DefaultListener
import org.slf4j.LoggerFactory
import studio.izan.duvua.music.types.PostgresOptions

class DuvuaMusic(private val token: String, private val postgresOptions: PostgresOptions) {
    var client: JDA
    var dba: PostgresProvider
    private val logger = LoggerFactory.getLogger("DuvuaMusic")

    val listeningEvents: List<ListenerAdapter> = arrayListOf(
        DefaultListener(this)
    )

    init {
        logger.info("Starting")
        dba = PostgresProvider(postgresOptions)
        client = JDABuilder.createDefault(token).disableCache(
                CacheFlag.ACTIVITY,
                CacheFlag.EMOTE,
                CacheFlag.CLIENT_STATUS
        ).enableCache(
                CacheFlag.VOICE_STATE
        ).build()
    }
    fun run() {
        listeningEvents.forEach { evt -> client.addEventListener(evt) }
    }
}