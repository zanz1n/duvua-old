package studio.izan.duvua.music.player;

import com.sedmelluq.discord.lavaplayer.player.AudioPlayer;
import com.sedmelluq.discord.lavaplayer.player.event.AudioEventAdapter;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackEndReason;
import net.dv8tion.jda.api.entities.MessageEmbed;
import net.dv8tion.jda.api.entities.TextChannel;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import studio.izan.duvua.music.types.SEmbedBuilder;
import studio.izan.duvua.music.utils.ExitVoiceChannelKt;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class TrackScheduler extends AudioEventAdapter {
    private final AudioPlayer audioPlayer;
    private final BlockingQueue<AudioTrack> queue;
    private final Logger logger = LoggerFactory.getLogger(this.getClass().getName());
    @Nullable
    private TextChannel messageChannel;
    private Boolean loop = false;

    public TrackScheduler(AudioPlayer audioPlayer, TextChannel textChannel) {
        this.audioPlayer = audioPlayer;
        this.queue = new LinkedBlockingQueue<>();
        this.messageChannel = textChannel;
    }

    public void enqueue(AudioTrack track) {
        if (!this.audioPlayer.startTrack(track, true)) {
            this.queue.offer(track);
        }
    }

    @Nullable
    private AudioTrack nextTrack() {
        final AudioTrack next = this.queue.poll();
        this.audioPlayer.startTrack(next, false);
        return next;
    }

    @Nullable
    public AudioTrack skipTrack() {
        loop = false;
        return nextTrack();
    }

    private void resolveQueueEnd(AudioPlayer player) {
        if (this.messageChannel == null) {
            logger.info("messageChannel is null");
        } else {
            ExitVoiceChannelKt.exitVoiceChannel(this.messageChannel.getGuild());
            final MessageEmbed embed = SEmbedBuilder
                    .createDefault("A playlist/fila foi acabou!");
            messageChannel.sendMessageEmbeds(embed).queue();
        }
        player.stopTrack();
        queue.clear();
    }

    @Override
    public void onTrackEnd(AudioPlayer player, AudioTrack track, AudioTrackEndReason endReason) {
        if (this.loop) {
            this.audioPlayer.startTrack(track.makeClone(), false);
            return;
        }
        if (endReason.mayStartNext) {
            final AudioTrack next = nextTrack();
            if (next != null) return;
        } else if (endReason == AudioTrackEndReason.REPLACED) {
            return;
        }
        resolveQueueEnd(player);
    }
    public AudioPlayer getAudioPlayer() {
        return audioPlayer;
    }
    public BlockingQueue<AudioTrack> getQueue() {
        return queue;
    }
    public TextChannel getMessageChannel() {
        return messageChannel;
    }
    public void setMessageChannel(TextChannel messageChannel) {
        this.messageChannel = messageChannel;
    }
    public Boolean isLooping() {
        return loop;
    }
    public void setLoop(Boolean loop) {
        this.loop = loop;
    }
}