package studio.izan.duvua.music.utils

import net.dv8tion.jda.api.interactions.Interaction
import studio.izan.duvua.music.DuvuaMusic
import studio.izan.duvua.music.player.PlayerManager
import studio.izan.duvua.music.types.SEmbedBuilder

public fun admUpdateVerify(interaction: Interaction, client: DuvuaMusic): Boolean {
    val firstVerify = admCreateVerify(interaction, client)

    if (!firstVerify) return false

    val musicManager = PlayerManager.getInstance().getMusicManager(interaction.guild)

    if (interaction.guild!!.selfMember.voiceState?.inVoiceChannel() != true
        || musicManager.audioPlayer.playingTrack == null) {

        val embed = SEmbedBuilder.createDefault("Não tem nenhum som na playlist, ${mention(interaction.user)}")
        interaction.replyEmbeds(embed).queue()
        return false
    }

    return true
}

public fun admCreateVerify(interaction: Interaction, client: DuvuaMusic): Boolean {
    val member = interaction.member ?: return false

    val memberProvider = client.dba.getMember(member)

    if (!memberProvider.isDj()) {
        val embed = SEmbedBuilder.createDefault("Você não tem permissão para usar" +
                " esse comando, ${mention(interaction.user)}")
        interaction.replyEmbeds(embed).queue()
        return false
    }

    val vc = interaction.member?.voiceState?.channel

    if (vc == null) {
        val embed = SEmbedBuilder.createDefault("Você precisa estar em um canal de voz para" +
                "usar esse comando, ${mention(interaction.user)}")
        interaction.replyEmbeds(embed).queue()
        return false
    }

    return true
}

public fun defaultCreateVerify(interaction: Interaction, client: DuvuaMusic): Boolean {
    val member = interaction.member ?: return false

    val memberProvider = client.dba.getMember(member)

    if (!memberProvider.isAllowedToPlay()) {
        val embed = SEmbedBuilder.createDefault("Você não tem permissão para usar" +
                " esse comando, ${mention(interaction.user)}")
        interaction.replyEmbeds(embed).queue()
        return false
    }

    val vc = interaction.member?.voiceState?.channel

    if (vc == null) {
        val embed = SEmbedBuilder.createDefault("Você precisa estar em um canal de voz para" +
                "usar esse comando, ${mention(interaction.user)}")
        interaction.replyEmbeds(embed).queue()
        return false
    }

    return true
}
