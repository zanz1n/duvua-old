package utils

import (
	"fmt"

	"github.com/bwmarrin/discordgo"
)

func BasicResponse(format string, args ...any) *discordgo.InteractionResponse {
	return &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: fmt.Sprintf(format, args...),
		},
	}
}

func BasicResponseEdit(format string, args ...any) *discordgo.WebhookEdit {
	fmt := fmt.Sprintf(format, args...)
	return &discordgo.WebhookEdit{
		Content: &fmt,
	}
}
