import { Addable } from "@lavaclient/queue"
import { ApplicationCommandOptionType, GuildMember } from "discord.js"
import { createMentionByUser as men } from "../../modules/createMentionByUser"
import { logger } from "../../modules/logger"
import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
import { sEmbed } from "../../types/discord/sEmbed"

export const command: CommandBase = {
    category: CommandBaseCategory.MUSIC,
    enabled: true,
    ephemeral: false,
    needsDefer: true,
    data: {
        name: "play",
        description: "Toca uma música do youtube",
        options: [
            {
                name: "song",
                description: "A url ou o nome do som que deseja pesquisar",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },

    async run({interaction, client}) {
        if (!interaction.guild) return
        if (!interaction.member || !(interaction.member instanceof GuildMember)) return
        if (!interaction.channel) return

        const embed = new sEmbed()

        const vc = interaction.member.voice.channel

        if (!vc) {
            embed.setDescription(`**Você precisa estar conectado a um canal de voz para usar esse comando ${men(interaction.user)}**`)
            interaction.editReply({ content: null, embeds: [embed] })
            return
        }
        const player = client.music.players.get(interaction.guild.id)
        ?? client.music.createPlayer(interaction.guild.id)

        const results = await client.music.rest.loadTracks("https://youtu.be/Vk7WCUYSV4A")

        let tracks: Addable[] = []
        let msg = ""
        if (results.loadType == "LOAD_FAILED" || results.loadType == "NO_MATCHES") {
            embed.setDescription(`**Algo deu errado tentando carregar a música, ${men(interaction.user)}**`).setFooter({
                text: "Tentar de novo ou verificar se o vídeo não possúi nenhum tipo de restrição pode ser um boa ideia"
            })
            interaction.editReply({ content: null, embeds: [embed] })
            return
        }
        else if (results.loadType == "PLAYLIST_LOADED") {
            tracks = results.tracks
            msg = `Playlist loaded with size ${results.tracks.length}`
        }
        else if (results.loadType == "SEARCH_RESULT" || results.loadType == "TRACK_LOADED") {
            const [track] = results.tracks
            tracks = [track]
            msg = `Track \`${track.info.title}\` from ${track.info.author} loaded`
        }
        embed.setDescription(msg)

        if (!player.connected) {
            await player.connect(vc.id)
        }

        const started = player.playing || player.paused

        interaction.editReply({
            content: null,
            embeds: [embed]
        })

        await player.queue.add(tracks, { requester: interaction.user.id })
        if (!started) {
            logger.debug(player)
            await player.queue.start()
        }
    }
}
