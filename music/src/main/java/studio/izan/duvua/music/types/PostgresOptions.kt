package studio.izan.duvua.music.types

interface PostgresOptions {

    val host: String
    val username: String
    val password: String
    val databaseName: String
    val maxPoolSize: Int?
}