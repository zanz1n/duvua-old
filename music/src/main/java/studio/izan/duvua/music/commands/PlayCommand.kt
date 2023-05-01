package studio.izan.duvua.music.commands

import net.dv8tion.jda.api.entities.TextChannel
import net.dv8tion.jda.api.events.interaction.SlashCommandEvent
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData
import org.slf4j.Logger
import studio.izan.duvua.music.DuvuaMusic
import studio.izan.duvua.music.player.PlayerManager
import studio.izan.duvua.music.types.ICommandBase
import studio.izan.duvua.music.types.SEmbedBuilder
import studio.izan.duvua.music.utils.defaultCreateVerify
import studio.izan.duvua.music.utils.mention
import java.net.URI
import java.net.URISyntaxException

class PlayCommand(private val logger: Logger): ICommandBase {
    override val name: String
        get() = "play"

    override val options: List<OptionData>
        get() = arrayListOf(
            OptionData(
                OptionType.STRING,
                "song",
                "A url ou o nome do som que deseja tocar",
                true
            )
        )

    private fun isUrl(url: String): Boolean {
        return try {
            URI(url)
            true
        } catch (e: URISyntaxException) {
            false
        }
    }

    override fun run(interaction: SlashCommandEvent, client: DuvuaMusic) {
        if (interaction.guild == null) return
        if (interaction.member == null) return

        val verify = defaultCreateVerify(interaction, client)

        if (!verify) return

        val vc = interaction.member!!.voiceState?.channel

        var song = interaction.options.find { opt -> opt.name == "song" }?.asString

        if (song == null || song.length > 150) {
            val embed = SEmbedBuilder.createDefault("Insira uma url ou um " +
                    "termo de pesquisa válido ${mention(interaction.user)}")

            interaction.replyEmbeds(embed).queue()
            return
        }

        interaction.replyEmbeds(SEmbedBuilder.createDefault("OK")).queue()

        if (interaction.guild!!.selfMember.voiceState?.inVoiceChannel() != true) {
            val audioManager = interaction.guild!!.audioManager;

            audioManager.openAudioConnection(vc);
        }

        val channel = interaction.channel as TextChannel

        if (!isUrl(song)) {
            song = "ytsearch:$song"
        }

        PlayerManager.getInstance().loadAndPlay(channel, song, interaction.member)
    }
}