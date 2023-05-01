package studio.izan.duvua.music.commands

import net.dv8tion.jda.api.interactions.Interaction
import org.slf4j.Logger
import studio.izan.duvua.music.DuvuaMusic
import studio.izan.duvua.music.player.PlayerManager
import studio.izan.duvua.music.player.progressbar.ProgressBarManager
import studio.izan.duvua.music.types.IButtonIntegrableCommandBase
import studio.izan.duvua.music.types.SEmbedBuilder
import studio.izan.duvua.music.utils.admUpdateVerify

class VolumeUpCommand(private val logger: Logger): IButtonIntegrableCommandBase {
    override val name: String
        get() = "volume-up"

    override fun run(interaction: Interaction, client: DuvuaMusic) {
        if (interaction.guild == null) return
        if (interaction.member == null) return

        val verify = admUpdateVerify(interaction, client)

        if (!verify) return

        val musicManager = PlayerManager.getInstance().getMusicManager(interaction.guild)

        val beforeVolume = musicManager.audioPlayer.volume

        if (beforeVolume + 25 > 200) {
            musicManager.audioPlayer.volume = 200
        } else {
            musicManager.audioPlayer.volume += 25
        }

        val embed = SEmbedBuilder
            .createDefault("O volume foi aumentado para ${musicManager.audioPlayer.volume}")

        interaction.replyEmbeds(embed).queue()

        ProgressBarManager.getInstance().forceUpdateMessages(interaction.guild)
    }

}