// import { ApplicationCommandOptionType, GuildMember, PermissionFlagsBits } from "discord.js"
// import { createMentionByUser as men } from "../../modules/createMentionByUser"
// import { logger } from "../../modules/logger"
// import { CommandBase, CommandBaseCategory } from "../../types/commandBase"
// import { sEmbed } from "../../types/discord/sEmbed"

// export const command: CommandBase = {
//     category: CommandBaseCategory.MUSIC,
//     enabled: true,
//     ephemeral: false,
//     needsDefer: true,
//     data: {
//         name: "play",
//         description: "Toca uma música do youtube",
//         descriptionLocalizations: { "en-US": "Plays a music from youtube" },
//         options: [
//             {
//                 name: "song",
//                 description: "A url ou o nome do som que deseja pesquisar",
//                 descriptionLocalizations: { "en-US": "The url or name of the song you want to play" },
//                 type: ApplicationCommandOptionType.String,
//                 required: true
//             }
//         ]
//     },

//     async run({interaction, client}) {
//         logger.debug("run")
//         if (!interaction.member || !(interaction.member instanceof GuildMember))
//             throw new Error("CommandInteraction<CacheType>.member not instanceof GuildMember")
//         if (!interaction.guild) throw new Error("CommandInteraction<CacheType>.guild not instanceof Guild")

//         const { member } = interaction
//         const song = interaction.options.getString("song", true)

//         if (!song.startsWith("https://") && song.length > 150) {
//             const embed = sEmbed.utils.defaultMessage(`Pesquisas com mais de 150 caracteres tendem não retornar resultados válidos, ${men(interaction.user)}`)
//             interaction.editReply({ content: null, embeds: [embed] })
//             return
//         }

//         const guildDb = await client.dba.guild.getOrCreateFromGuild(interaction.guild, false)

//         if (guildDb.musicStrictM) {
//             const memberDb = await client.dba.member.getOrCreateFromMember(interaction.member)

//             if (!memberDb.playAllowed || !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
//                 const embed = sEmbed.utils
//                     .defaultMessage(`Você não tem permissão para tocar músicas nesse servidor ${men(interaction.user)}`)
//                 interaction.editReply({ content: null, embeds: [embed] })
//                 return
//             }
//         }
    
//         const vc = interaction.member.voice.channel

//         if (!vc) {
//             const embed = sEmbed.utils
//                 .defaultMessage(`Você precisa estar em um canal de voz para usar esse comand, ${men(interaction.user)}`)
//             interaction.editReply({ content: null, embeds: [embed] })
//             return
//         }
//         const node = client.music.getNode()

//         if (!node) throw new Error("Lavalink node sort failed")

//         let player = node.players.get(interaction.guild.id)

//         if (!player) {
//             player = await node.joinChannel({
//                 channelId: vc.id,
//                 guildId: interaction.guild.id,
//                 shardId: 0,
//                 deaf: true
//             })
//         }
//         player.on("end", (d) => {
//             logger.debug(d)
//         })

//         const songQuery = song.startsWith("https://") ? song : `scsearch:${song}`

//         const result = await node.rest.resolve(songQuery)

//         if (!result || result.loadType == "LOAD_FAILED" || result.loadType == "NO_MATCHES" || !result.tracks[0]) {
//             const embed = sEmbed.utils
//                 .defaultMessage(`Não foi possível encontrar nenhum som pesquisando por \`${song}\`, ${men(interaction.user)}`)
//             interaction.editReply({ content: null, embeds: [embed] })
//             return
//         }

//         const embed = new sEmbed()

//         if (result.loadType == "PLAYLIST_LOADED") {
//             let trackN = 1
//             let trackText = ""

//             result.tracks.forEach(track => {
//                 player!.playTrack(track)
//                 trackText += `${trackN} - [${track.info.title}](${track.info.uri}) **por** ${track.info.author} com **duração:** ${track.info.length}\n`
//                 trackN++
//             })

//             embed.setDescription(`**Playlsit ${result.playlistInfo.name} carrecada com ${result.tracks.length} músicas**\n\n${trackText}`)
//         }

//         else if (result.loadType == "SEARCH_RESULT" || result.loadType == "TRACK_LOADED") {
//             const track = result.tracks[0]

//             node.queue.add()

//             player.playTrack(track)

//             embed.setDescription(`Track [${track.info.title}](${track.info.uri}) **por** ${track.info.author} com **duração:** ${track.info.length}`)
//         }
//         else throw new Error("Lavalink load type no matches")

//         embed.setFooter({
//             text: `Requisitado por ${interaction.user.username}`,
//             iconURL: member.displayAvatarURL({ forceStatic: true })
//                 ?? interaction.user.displayAvatarURL({ forceStatic: true })
//         })

//         interaction.editReply({ content: null, embeds: [embed] })
//     }
// }
