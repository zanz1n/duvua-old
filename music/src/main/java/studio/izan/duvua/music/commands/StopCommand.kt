package studio.izan.duvua.music.commands

import net.dv8tion.jda.api.interactions.Interaction
import org.slf4j.Logger
import studio.izan.duvua.music.DuvuaMusic
import studio.izan.duvua.music.player.PlayerManager
import studio.izan.duvua.music.types.IButtonIntegrableCommandBase
import studio.izan.duvua.music.types.SEmbedBuilder
import studio.izan.duvua.music.utils.mention
import studio.izan.duvua.music.utils.admUpdateVerify

class StopCommand(private val logger: Logger): IButtonIntegrableCommandBase {
    override val name: String
        get() = "stop"

    override fun run(interaction: Interaction, client: DuvuaMusic) {
        if (interaction.guild == null) return
        if (interaction.member == null) return

        val verify = admUpdateVerify(interaction, client)

        if (!verify) return

        val musicManager = PlayerManager.getInstance().getMusicManager(interaction.guild)

        val embed = SEmbedBuilder.createDefault("A playlist foi limpa por ${mention(interaction.user)}")

        val reply = interaction.replyEmbeds(embed)

        musicManager.scheduler.setLoop(false)
        musicManager.scheduler.audioPlayer.stopTrack()
        musicManager.scheduler.queue.clear()

        reply.queue()
    }
}