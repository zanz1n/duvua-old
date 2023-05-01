package studio.izan.duvua.music.dba

import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.entities.Member
import java.sql.Connection
import java.sql.SQLException


class MemberProvider(
    private val connection: Connection,
    private val member: Member) {

    fun isAllowedToPlay(): Boolean {
        if (member.permissions.contains(Permission.ADMINISTRATOR)) {
            connection.close()
            return true
        }

        val statement = connection.prepareStatement(
            "SELECT \"musicStrictM\" FROM \"Guild\" WHERE \"dcId\" = (?);"
        )
        statement.setString(1, member.guild.id)
        var strictMusicMode = false

        val result = statement.executeQuery()
        result.next()
        try {
            strictMusicMode = result.getBoolean("musicStrictM")
        } catch (_: SQLException) {}

        if (strictMusicMode) {
            if (!member.permissions.contains(Permission.ADMINISTRATOR)) {
                val memberStatement = connection.prepareStatement(
                    "SELECT \"playAllowed\" FROM \"Member\" WHERE \"guildId\" = (?);"
                )
                memberStatement.setString(1, member.guild.id)

                var hasPermission = false

                val memberResult = memberStatement.executeQuery()
                memberResult.next()

                try {
                    hasPermission = memberResult.getBoolean("playAllowed")
                } catch (_: SQLException) {}
                connection.close()
                return hasPermission
            }
        }
        connection.close()
        return true
    }

    fun isDj(): Boolean {
        if (member.permissions.contains(Permission.ADMINISTRATOR)) {
            connection.close()
            return true
        }

        val statement = connection.prepareStatement(
            "SELECT \"dj\" FROM \"Member\" WHERE \"guildId\" = (?);"
        )
        statement.setString(1, member.guild.id)

        var dj = false

        val result = statement.executeQuery()
        result.next()

        try {
            dj = result.getBoolean("dj")
        } catch (_: SQLException) {}
        connection.close()
        return dj
    }
}