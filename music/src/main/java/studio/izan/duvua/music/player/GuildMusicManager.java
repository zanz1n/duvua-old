package studio.izan.duvua.music.player;

import com.sedmelluq.discord.lavaplayer.player.AudioPlayer;
import com.sedmelluq.discord.lavaplayer.player.AudioPlayerManager;
import net.dv8tion.jda.api.entities.TextChannel;
import org.jetbrains.annotations.Nullable;

public class GuildMusicManager {
    private final AudioPlayer audioPlayer;
    private final TrackScheduler scheduler;
    @Nullable
    private TextChannel messageChannel;
    private final AudioPlayerSendHandler sendHandler;

    public GuildMusicManager(AudioPlayerManager manager) {
        this.audioPlayer = manager.createPlayer();
        this.scheduler = new TrackScheduler(this.audioPlayer, this.messageChannel);
        this.audioPlayer.addListener(this.scheduler);
        this.sendHandler = new AudioPlayerSendHandler(this.audioPlayer);
    }

    public AudioPlayer getAudioPlayer() {
        return audioPlayer;
    }

    public AudioPlayerSendHandler getSendHandler() {
        return sendHandler;
    }

    public TrackScheduler getScheduler() {
        return scheduler;
    }

    public TextChannel getMessageChannel() {
        return messageChannel;
    }

    public void setMessageChannel(TextChannel messageChannel) {
        this.messageChannel = messageChannel;
    }

    public void setLoop(Boolean value) {
        this.scheduler.setLoop(value);
    }

    public boolean isLooping() {
        return this.scheduler.isLooping();
    }
}