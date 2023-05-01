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

class PauseCommand(private val logger: Logger): IButtonIntegrableCommandBase {
    override val name: String
        get() = "pause"

    override fun run(interaction: Interaction, client: DuvuaMusic) {
        if (interaction.guild == null) return
        if (interaction.member == null) return

        val verify = admUpdateVerify(interaction, client)

        if (!verify) return

        val musicManager = PlayerManager.getInstance().getMusicManager(interaction.guild)

        val embed = SEmbedBuilder.createDefault("A fila foi pausada por ${mention(interaction.user)}")

        val message = MessageBuilder()
            .setEmbeds(embed)
            .setActionRows(ActionRow.of(DefaultButtons.resumeButton))
            .build()

        musicManager.audioPlayer.isPaused = true

        interaction.reply(message).queue()
    }
}