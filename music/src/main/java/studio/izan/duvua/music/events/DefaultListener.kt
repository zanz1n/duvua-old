package studio.izan.duvua.music.events

import net.dv8tion.jda.api.events.interaction.ButtonClickEvent
import net.dv8tion.jda.api.events.interaction.SlashCommandEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import org.slf4j.LoggerFactory
import studio.izan.duvua.music.DuvuaMusic
import studio.izan.duvua.music.commands.*
import studio.izan.duvua.music.types.IButtonIntegrableCommandBase
import studio.izan.duvua.music.types.ICommandBase
import kotlin.concurrent.thread

class DefaultListener(private val client: DuvuaMusic): ListenerAdapter() {
    private val logger = LoggerFactory.getLogger("CommandEvent")

    val listeningCommands: List<ICommandBase> = arrayListOf(
        PlayCommand(logger),
        VolumeCommand(logger),
    )

    val buttonIntegrableListengCommands: List<IButtonIntegrableCommandBase> = arrayListOf(
        StopCommand(logger),
        PauseCommand(logger),
        ResumeCommand(logger),
        VolumeUpCommand(logger),
        VolumeDownCommand(logger),
        LoopCommand(logger),
        QueueCommand(logger),
        SkipCommand(logger)
    )

    override fun onSlashCommand(event: SlashCommandEvent) {
        if (event.user.isBot) return
        if (event.guild == null) return
        thread(
            start = true,
            isDaemon = false,
            contextClassLoader = null,
            name = "CMD-${event.name.uppercase()}-Thread-${System.currentTimeMillis()}"
        ) {
            val command = listeningCommands.find { cmd -> cmd.name == event.name }
            if (command == null) {
                val cmd = buttonIntegrableListengCommands.find { cmd -> cmd.name == event.name }
                cmd?.run(event, client)
                return@thread
            }
            else command.run(event, client)
            return@thread
        }
    }

    override fun onButtonClick(event: ButtonClickEvent) {
        if (event.user.isBot) return
        if (event.guild == null) return
        thread(
            start = true,
            isDaemon = false,
            contextClassLoader = null,
            name = "BTN-${event.button?.id?.uppercase()}-Thread-${System.currentTimeMillis()}") {
            val command = buttonIntegrableListengCommands.find { btnI ->
                btnI.name+"-button" == event.interaction.button?.id
            }
            command?.run(event, client)
            return@thread
        }
    }
}