package studio.izan.duvua.music.commands

import net.dv8tion.jda.api.interactions.Interaction
import org.slf4j.Logger
import studio.izan.duvua.music.DuvuaMusic
import studio.izan.duvua.music.player.PlayerManager
import studio.izan.duvua.music.types.IButtonIntegrableCommandBase
import studio.izan.duvua.music.types.SEmbedBuilder
import studio.izan.duvua.music.utils.admUpdateVerify

class LoopCommand(private val logger: Logger): IButtonIntegrableCommandBase {
    override val name: String
        get() = "loop"

    override fun run(interaction: Interaction, client: DuvuaMusic) {
        if (interaction.member == null) return
        if (interaction.guild == null) return

        val verify = admUpdateVerify(interaction, client)

        if (!verify) return

        val musicManager = PlayerManager.getInstance().getMusicManager(interaction.guild)
        val looping = musicManager.isLooping

        val message = if (looping) "Loop desativado" else "Loop ativado"

        musicManager.setLoop(!looping)

        interaction.replyEmbeds(SEmbedBuilder.createDefault(message)).queue()
    }
}