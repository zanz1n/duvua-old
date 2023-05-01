package studio.izan.duvua.music.utils;

import net.dv8tion.jda.api.entities.Emoji;
import net.dv8tion.jda.api.interactions.components.ActionRow;
import net.dv8tion.jda.api.interactions.components.Button;

public class DefaultButtons {
    public static Button skipButton = Button.primary("skip-button", "Skip")
            .withEmoji(Emoji.fromUnicode("⏭️"));

    public static Button stopButton = Button.danger("stop-button", "Stop")
            .withEmoji(Emoji.fromUnicode("⏹️"));

    public static Button pauseButton = Button.primary("pause-button", "Pause")
            .withEmoji(Emoji.fromUnicode("⏹️"));

    public static Button resumeButton = Button.success("resume-button", "Resume")
            .withEmoji(Emoji.fromUnicode("▶️"));

    public static Button loopButton = Button.primary("loop-button", "Loop")
            .withEmoji(Emoji.fromUnicode("🔁"));

    public static Button volumeUpButton = Button.secondary("volume-up-button", "+ Volume")
            .withEmoji(Emoji.fromUnicode("🔊"));

    public static Button volumeDownButton = Button.secondary("volume-down-button", "- Volume")
            .withEmoji(Emoji.fromUnicode("🔉"));

    public static Button queueButton = Button.primary("queue-button", "Playlist")
            .withEmoji(Emoji.fromUnicode("🎵"));

    public static ActionRow defaultActionRow = ActionRow.of(
            skipButton,
            stopButton,
            pauseButton,
            resumeButton
    );

    public static ActionRow defaultActionRow2 = ActionRow.of(
            loopButton,
            volumeUpButton,
            volumeDownButton,
            queueButton
    );
}
