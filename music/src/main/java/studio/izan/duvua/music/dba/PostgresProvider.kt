package studio.izan.duvua.music.dba

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import net.dv8tion.jda.api.entities.Member
import org.slf4j.LoggerFactory
import studio.izan.duvua.music.types.PostgresOptions
import java.sql.Connection
import kotlin.concurrent.thread

class PostgresProvider(
    private val dbOptions: PostgresOptions
) {
    private val logger = LoggerFactory.getLogger("PostgresProvider")
    private fun getDataSource(): HikariDataSource {
        logger.info("Connecting to datasource...")

        val hikariConfig = HikariConfig().apply {
            jdbcUrl = "jdbc:postgresql://${dbOptions.host}/${dbOptions.databaseName}"
            driverClassName = "org.postgresql.Driver"
            username = dbOptions.username
            password = dbOptions.password
            maximumPoolSize = dbOptions.maxPoolSize ?: 14
            isAutoCommit = false
            validate()
        }

        val dataSource = HikariDataSource(hikariConfig)
        hikariConfig.dataSource = dataSource
        logger.info("Connected to datasource")
        return dataSource
    }

    private val dataSource = getDataSource()

    fun getMember(member: Member): MemberProvider {
        return MemberProvider(this.dataSource.connection, member)
    }
}