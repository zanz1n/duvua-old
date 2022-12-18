import { ChannelType, Events, GuildMember } from "discord.js"
import { Duvua } from "../Client"
import { EventBase } from "../types/eventBase"
import { createMentionByUser as men } from "../modules/createMentionByUser"
import { Welcome } from "@prisma/client"
import { sEmbed } from "../types/discord/sEmbed"

export const event: EventBase = {
    name: Events.GuildMemberAdd,
    enabled: true,
    async run(member: GuildMember, client: Duvua) {
        const cache = await client.redis.getex(`welcome-${member.guild.id}`, "EX", 120)

        let welcomeDb: Welcome

        if (!cache) {
            const welcomeDb2 = await client.prisma.welcome.findFirst({
                where: {
                    guildDcId: member.guild.id
                }
            })
            if (!welcomeDb2 || !welcomeDb2?.channelId) return

            welcomeDb = welcomeDb2

            client.redis.set(`welcome-${member.guild.id}`, JSON.stringify(welcomeDb), "EX", 120)
        } else welcomeDb = JSON.parse(cache) as Welcome

        if (!welcomeDb || !welcomeDb?.channelId || !welcomeDb.enabled) return

        const channelToSend = member.guild.channels.cache.get(welcomeDb.channelId) ?? await member.guild.channels.fetch(welcomeDb.channelId)

        if (!channelToSend || channelToSend.type != ChannelType.GuildText) return

        let message = welcomeDb.message
            .replaceAll("{USER}", men(member.user))
            .replaceAll("{GUILD}", member.guild.name)
                
        if (message.includes("{POSITION}")) {
            const count = ((await member.guild.members.fetch()).size + 1).toString()
            message = message.replaceAll("{POSITION}", count)
        }

        if (welcomeDb.type == "EMBED" || welcomeDb.type == "IMAGE") {
            const embed = sEmbed.utils.defaultMessage(message)
            channelToSend.send({ embeds: [embed] })
        }
        else if (welcomeDb.type == "MESSAGE") {
            channelToSend.send({ content: message })
        }
        return
    }
}
