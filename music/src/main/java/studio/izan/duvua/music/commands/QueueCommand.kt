package studio.izan.duvua.music.commands

import net.dv8tion.jda.api.interactions.Interaction
import org.slf4j.Logger
import studio.izan.duvua.music.DuvuaMusic
import studio.izan.duvua.music.player.PlayerManager
import studio.izan.duvua.music.types.IButtonIntegrableCommandBase
import studio.izan.duvua.music.types.SEmbedBuilder
import studio.izan.duvua.music.utils.mention
import studio.izan.duvua.music.utils.parseMsIntoStringForm

class QueueCommand(private val logger: Logger): IButtonIntegrableCommandBase {
    override val name: String
        get() = "queue"

    override fun run(interaction: Interaction, client: DuvuaMusic) {
        if (interaction.guild == null) return

        val musicManager = PlayerManager.getInstance().getMusicManager(interaction.guild)

        val currentTrack = musicManager.audioPlayer.playingTrack

        if (currentTrack == null) {
            val embed = SEmbedBuilder.createDefault("A playlist está limpa ${mention(interaction.user)}")
            interaction.replyEmbeds(embed).queue()
            return
        }
        val currentInfo = currentTrack.info

        var description = "TOCANDO " + "**[" + parseMsIntoStringForm(currentTrack.position) + " / " +
                parseMsIntoStringForm(currentTrack.duration) + "]**" +
                " - **[${currentInfo.title}](${currentInfo.uri})** por **" +
                currentInfo.author + "**\n"
        var cont = 1

        musicManager.scheduler.queue.forEach { track ->
            run {
                val info = track.info
                description += "$cont - **[${info.title}](${info.uri})** por **" + info.author + "\n"
                cont++
            }
        }

        val embed = SEmbedBuilder().setDescription(description).setTitle("Playlist").build()

        interaction.replyEmbeds(embed).queue()
    }
}