package studio.izan.duvua.music.player.progressbar

import com.sedmelluq.discord.lavaplayer.track.AudioTrack
import com.sedmelluq.discord.lavaplayer.track.AudioTrackState
import net.dv8tion.jda.api.entities.Member
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.entities.MessageEmbed
import net.dv8tion.jda.api.entities.TextChannel
import net.dv8tion.jda.api.interactions.components.ActionRow
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import studio.izan.duvua.music.player.PlayerManager
import studio.izan.duvua.music.types.SEmbedBuilder
import studio.izan.duvua.music.utils.parseMsIntoStringForm
import java.lang.Exception
import kotlin.concurrent.thread

class ProgressbarDaemon(
    val channel: TextChannel,
    val track: AudioTrack,
    private val actionRows: List<ActionRow>,
    private val member: Member
): Runnable {

    private val trackProgressbar: TrackProgressbar = TrackProgressbar(track)

    private val logger: Logger = LoggerFactory.getLogger("ProgressbarDaemon");

    private enum class EmbedStates(s: String) {
        NOT_STARTED("NOTSTARTED"),
        PLAYING("PLAYING"),
        FINISHED("FINISHED")
    }

    private val interval = 2000L

    private val info = track.info

    private val player = PlayerManager.getInstance().getMusicManager(member.guild).audioPlayer

    private fun makeEmbed(bar: String, state: EmbedStates): MessageEmbed {
        val description = "Música [**" + info.title + "**]("+
                info.uri + ") de **" + info.author + "**\n\n" + bar

        val embed = SEmbedBuilder()
            .setDescription(description)
            .setThumbnail(PlayerManager.getThumbnailByUri(info.uri))

        embed.setFooter(
            "Requisitado por ${member.nickname ?: member.user.name}",
            member.avatarUrl ?: member.user.avatarUrl,
        )

        if (state == EmbedStates.FINISHED) {
            embed.addField("Duração",
                "Finalizada!",
                true)
        } else if (state == EmbedStates.PLAYING) {
            embed.addField("Duração",
                parseMsIntoStringForm(track.position) + " / " +
                        parseMsIntoStringForm(track.duration),
                true)
        } else if (state == EmbedStates.NOT_STARTED) {
            embed.addField("Duração",
                "Não iniciada!",
                true)
        }

        embed.addField("Volume", "${player.volume}% / 200%", true)

        return embed.build()
    }

    private lateinit var message: Message

    private var updating = false

    init {
        channel.sendMessageEmbeds(makeEmbed(trackProgressbar.getStringBar(), EmbedStates.NOT_STARTED)).setActionRows(actionRows)
            .queue {msg ->
                run {
                    this.message = msg
                }
            }
    }

    private var active = true

    fun forceUpdate() {
        thread {
            updating = true
            update()
            Thread.sleep(100)
            updating = false
            return@thread
        }
    }

    public fun isActive(): Boolean {
        return active
    }

    private fun update(): Boolean {
        if (track.state == AudioTrackState.FINISHED) {
            try {
                trackProgressbar.percentage = 100F
                val progressbar = trackProgressbar.getStringBar()
                message.editMessageEmbeds(makeEmbed(progressbar, EmbedStates.FINISHED)).queue()
            } catch (_: Exception) { }
            return true
        }
        else if (track.state == AudioTrackState.PLAYING) {
            try {
                val progressbar = trackProgressbar.getStringBar()
                message.editMessageEmbeds(makeEmbed(progressbar, EmbedStates.PLAYING)).queue()
            } catch (err: Error) {
                return true
                logger.error(err.message)
            }
            if (trackProgressbar.percentage == 100F) return true
        }
        return false
    }

    override fun run() {
        var mustEnd = false
        while (true) {
            Thread.sleep(interval)
            if (!this.updating) {
                mustEnd = update()
            }
            if (mustEnd) {
                active = false
                return
            }
        }
    }
}