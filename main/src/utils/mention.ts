import { User } from "discord.js";

export function men(user: User) {
    return `<@${user.id}>`;
}
