package utils

import "github.com/bwmarrin/discordgo"

func NewSession(token string, intent *discordgo.Intent) (*discordgo.Session, error) {
	client, err := discordgo.New("Bot "+token)

	if err != nil {
		return nil, err
	}

	if intent == nil {
		client.Identify.Intents = discordgo.MakeIntent(discordgo.IntentsAll)
	} else {
		client.Identify.Intents = *intent
	}

	return client, nil
}
