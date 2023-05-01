package studio.izan.duvua.music.utils

import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.TextChannel
import kotlin.concurrent.thread

public fun exitVoiceChannel(guild: Guild): Thread {
    return thread {
        if (guild.selfMember.voiceState?.inVoiceChannel() != true) {
            return@thread
        }
        guild.audioManager.closeAudioConnection()
        return@thread
    }
}