package studio.izan.duvua.music.types

import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.entities.MessageEmbed

class SEmbedBuilder : EmbedBuilder() {
    init {
        this.setColor(16720372)
    }

    companion object {
        @JvmStatic
        fun createDefault(text: String): MessageEmbed {
            return SEmbedBuilder().setDescription("**$text**").build()
        }
    }
}