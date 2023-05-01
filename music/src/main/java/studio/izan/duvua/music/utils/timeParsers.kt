package studio.izan.duvua.music.utils

public fun parseMsIntoStringForm(n: Long): String {
    val hour = (n / 3600000).toInt()
    val minutes = (n / 60000 - hour * 60).toInt()
    val seconds = (n / 1000 - minutes * 60 - hour * 3600).toInt()

    return if (hour == 0) {
        if (minutes == 0) {
            "${seconds}s"
        } else "${minutes}m:${seconds}s"
    } else {
        "${hour}h:${minutes}m:${seconds}s"
    }
}

public fun parseMsIntoStringForm(ns: String): String {
    val n = ns.toLong()
    return parseMsIntoStringForm(n)
}
