package providers

import (
	"fmt"

	"github.com/bwmarrin/discordgo"
)

type Command struct {
	Handler func(c *discordgo.Session, e *discordgo.InteractionCreate) error
	Data    discordgo.ApplicationCommand
}

type CommandHandler struct {
	commands map[string]Command
	session  *discordgo.Session
}

func (c *CommandHandler) AddCommand(cmd Command) {
	c.commands[cmd.Data.Name] = cmd
}

func (c *CommandHandler) GetData() []*discordgo.ApplicationCommand {
	arr := make([]*discordgo.ApplicationCommand, len(c.commands))

	i := 0
	for _, v := range c.commands {
		arr[i] = &v.Data
		i++
	}

	return arr
}

func (c *CommandHandler) onInteraction(s *discordgo.Session, e *discordgo.InteractionCreate) {

}

func (c *CommandHandler) PostCommands() ([]*discordgo.ApplicationCommand, error) {
	data := c.GetData()
	for _, v := range data {
		_, err := c.session.ApplicationCommandCreate(c.session.State.User.ID, "", v)
		fmt.Printf("Failed to post command %s: %s", v.Name, err.Error())
	}

	return data, nil
}

func NewCommandHandler(s *discordgo.Session) *CommandHandler {
	handler := &CommandHandler{
		commands: make(map[string]Command),
		session:  s,
	}

	s.AddHandler(handler.onInteraction)

	return handler
}
