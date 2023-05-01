package studio.izan.duvua.music.types

import net.dv8tion.jda.api.events.interaction.SlashCommandEvent
import net.dv8tion.jda.api.interactions.commands.build.OptionData
import studio.izan.duvua.music.DuvuaMusic
import javax.annotation.Nullable

interface ICommandBase {
    val name: String

    @Nullable
    val options: List<OptionData>?

    fun run(interaction: SlashCommandEvent, client: DuvuaMusic)
}