package events

import (
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/zanz1n/duvua-bot/music/providers"
)

func NewReadyListener(handler *providers.CommandHandler) func(s *discordgo.Session, e *discordgo.Ready) {
	return func(s *discordgo.Session, e *discordgo.Ready) {
		log.Println("Client ready")
		cmds, err := handler.PostCommands()

		if err != nil {
			log.Println("Failed to post commands: " + err.Error())
		} else {
			log.Printf("%v commands posted", len(cmds))
		}
	}
}
