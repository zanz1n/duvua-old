package commands

import (
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/zanz1n/duvua-bot/music/providers"
)

var pingCommandData = discordgo.ApplicationCommand{
	Name:        "ping",
	Description: "Responde com pong e mostra o ping do bot",
}

func handlePingCommand() func(s *discordgo.Session, e *discordgo.InteractionCreate) error {
	return func(s *discordgo.Session, e *discordgo.InteractionCreate) error {
		return s.InteractionRespond(e.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: fmt.Sprintf(
					"🏓 **Pong!**\n📡 Ping do bot: %vms",
					s.HeartbeatLatency().Milliseconds(),
				),
			},
		})
	}
}

func PingCommand() providers.Command {
	return providers.Command{
		Data: pingCommandData,
		Handler: handlePingCommand(),
	}
}
