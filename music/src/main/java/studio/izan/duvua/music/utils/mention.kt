package studio.izan.duvua.music.utils

import net.dv8tion.jda.api.entities.User

public fun mention(user: User): String {
    return "<@${user.id}>"
}