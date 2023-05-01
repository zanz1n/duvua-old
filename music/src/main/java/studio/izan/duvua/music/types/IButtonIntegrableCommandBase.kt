package studio.izan.duvua.music.types

import net.dv8tion.jda.api.events.interaction.SlashCommandEvent
import net.dv8tion.jda.api.interactions.Interaction
import studio.izan.duvua.music.DuvuaMusic

interface IButtonIntegrableCommandBase {
    val name: String

    fun run(interaction: Interaction, client: DuvuaMusic)
}