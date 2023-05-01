package studio.izan.duvua.music.commands

import net.dv8tion.jda.api.events.interaction.SlashCommandEvent
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData
import org.slf4j.Logger
import studio.izan.duvua.music.DuvuaMusic
import studio.izan.duvua.music.player.PlayerManager
import studio.izan.duvua.music.player.progressbar.ProgressBarManager
import studio.izan.duvua.music.player.progressbar.ProgressbarDaemon
import studio.izan.duvua.music.types.ICommandBase
import studio.izan.duvua.music.types.SEmbedBuilder
import studio.izan.duvua.music.utils.admUpdateVerify

class VolumeCommand(private val logger: Logger): ICommandBase {
    override val name: String
        get() = "volume"

    override val options: List<OptionData>
        get() = arrayListOf(
            OptionData(
                OptionType.INTEGER,
                "target",
                "O volume que deseja colocar o bot",
                true
            )
        )

    override fun run(interaction: SlashCommandEvent, client: DuvuaMusic) {
        val target = interaction.options.find { opt -> opt.name == "target" }?.asLong ?: return

        if (interaction.guild == null) return
        if (interaction.member == null) return

        val verify = admUpdateVerify(interaction, client)

        if (!verify) return

        if (target > 200) {
            val embed = SEmbedBuilder.createDefault("O volume máximo é 200!")
            interaction.replyEmbeds(embed).queue()
            return
        }

        val musicManager = PlayerManager.getInstance().getMusicManager(interaction.guild)

        musicManager.audioPlayer.volume = target.toInt()

        val embed = SEmbedBuilder.createDefault("O volume foi mudado para ${musicManager.audioPlayer.volume}")

        interaction.replyEmbeds(embed).queue()

        ProgressBarManager.getInstance().forceUpdateMessages(interaction.guild)
    }
}