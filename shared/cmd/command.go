package cmd

import "github.com/bwmarrin/discordgo"

type CommandAccepts struct {
	MessageComponent   bool
	ApplicationCommand bool
	ModalSubmit        bool
}

type CommandData struct {
	idx      string
	appCmd   *discordgo.ApplicationCommand
	isAppCmd bool
}

func MakeData(customID *string, appCmd *discordgo.ApplicationCommand) CommandData {
	if customID == nil && appCmd == nil {
		panic("one of the two arguments must not be nil")
	}

	data := CommandData{
		appCmd: nil,
		isAppCmd: false,
	}

	if appCmd == nil {
		data.idx = *customID
	} else {
		data.idx = appCmd.Name
		data.appCmd = appCmd
		data.isAppCmd = true
	}

	return data
}

type Command struct {
	Handler func(s *discordgo.Session, i *discordgo.InteractionCreate) error
	// When the command only accpets message components only the
	// name prop may be used
	Data CommandData
	// The kind of interaction that the command accepts
	Accepts CommandAccepts
}

func (c *Command) ApplicationCommand() (*discordgo.ApplicationCommand, bool) {
	if c.Data.isAppCmd {
		return c.Data.appCmd, true
	}
	return nil, false
}

func (c *Command) Key() string {
	return c.Data.idx
}
