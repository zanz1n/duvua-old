package studio.izan.duvua.music.player.progressbar

import com.sedmelluq.discord.lavaplayer.track.AudioTrack
import org.slf4j.LoggerFactory

class TrackProgressbar(private val track: AudioTrack) {
    private val logger = LoggerFactory.getLogger("TrackProgressbar")
    private val duration: Float = track.duration.toFloat()

    private val voidEmoji = "➖"
    private val pointerEmoji = "🔘"
    private val size = 18

    var percentage: Float = 0F

    public fun getStringBar(): String {
        var bar = ""
        percentage = (track.position / duration) * 100
        val refsize: Float = if (size > (duration / 1000)) {
                duration
            } else size.toFloat()

        if (percentage > (100-(100/refsize))-1) {
            percentage = 100F
        }
        val intendedPosition = (size * (percentage / 100)).toInt()
        for (i in 1..size) {
            if (i == intendedPosition) {
                bar += pointerEmoji
            } else bar += voidEmoji
        }
        return bar
    }
}