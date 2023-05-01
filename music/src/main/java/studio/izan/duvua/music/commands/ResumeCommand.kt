package studio.izan.duvua.music.commands

import net.dv8tion.jda.api.MessageBuilder
import net.dv8tion.jda.api.interactions.Interaction
import net.dv8tion.jda.api.interactions.components.ActionRow
import org.slf4j.Logger
import studio.izan.duvua.music.DuvuaMusic
import studio.izan.duvua.music.player.PlayerManager
import studio.izan.duvua.music.types.IButtonIntegrableCommandBase
import studio.izan.duvua.music.types.SEmbedBuilder
import studio.izan.duvua.music.utils.DefaultButtons
import studio.izan.duvua.music.utils.admUpdateVerify
import studio.izan.duvua.music.utils.mention

class ResumeCommand(private val logger: Logger): IButtonIntegrableCommandBase {
    override val name: String
        get() = "resume"

    override fun run(interaction: Interaction, client: DuvuaMusic) {
        if (interaction.guild == null) return
        if (interaction.member == null) return

        val verify = admUpdateVerify(interaction, client)

        if (!verify) return

        val musicManager = PlayerManager.getInstance().getMusicManager(interaction.guild)

        val embed = SEmbedBuilder.createDefault("A fila foi despausada por ${mention(interaction.user)}")

        val message = MessageBuilder()
            .setEmbeds(embed)
            .setActionRows(ActionRow.of(DefaultButtons.pauseButton))
            .build()

        musicManager.audioPlayer.isPaused = false

        interaction.reply(message).queue()
    }
}