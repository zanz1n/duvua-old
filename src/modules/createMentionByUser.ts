import { User } from "discord.js"

export function createMentionByUser(user: User): string {
    return `<@${user.id}>`
}