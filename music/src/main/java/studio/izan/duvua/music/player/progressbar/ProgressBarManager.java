package studio.izan.duvua.music.player.progressbar;

import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.entities.TextChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import studio.izan.duvua.music.utils.DefaultButtons;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProgressBarManager {
    private static ProgressBarManager INSTANCE;

    private final HashMap<String, List<ProgressbarDaemon>> daemonMap;

//    private final Logger logger = LoggerFactory.getLogger("ProgressBarManager");

    private ProgressBarManager() {
        this.daemonMap = new HashMap<>();
    }

    public void forceUpdateMessages(Guild guild) {
        List<ProgressbarDaemon> guildDaemons = daemonMap.get(guild.getId());
        if (guildDaemons == null) return;

        guildDaemons.forEach((progressbarDaemon) -> {
            if (progressbarDaemon.isActive()) {
                progressbarDaemon.forceUpdate();
            }
        });
    }

    public void createInternal(AudioTrack track, TextChannel channel, Member member) {
        List<ProgressbarDaemon> guildDaemons = daemonMap.get(member.getGuild().getId());
        if (guildDaemons == null) {
            guildDaemons = new ArrayList<>();
            daemonMap.put(member.getGuild().getId(), guildDaemons);
        }

        final ProgressbarDaemon newDaemon = new ProgressbarDaemon(channel, track,
                List.of(DefaultButtons.defaultActionRow, DefaultButtons.defaultActionRow2), member);

        guildDaemons.add(newDaemon);

        new Thread(newDaemon).start();
        return;
    }

    public static ProgressBarManager getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new ProgressBarManager();
        }
        return INSTANCE;
    }
}