package providers

import (
	"fmt"

	"github.com/bwmarrin/discordgo"
)

type Command struct {
	Handler func(c *discordgo.Session, e *discordgo.InteractionCreate) error
	Data    discordgo.ApplicationCommand
	Button  bool
	Command bool
}

type CommandHandler struct {
	commands   map[string]Command
	components map[string]Command
	session    *discordgo.Session
}

func (c *CommandHandler) AddCommand(cmd Command) {
	if cmd.Button {
		c.components[cmd.Data.Name] = cmd
	} else {
		c.commands[cmd.Data.Name] = cmd
	}
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
	if e.Type == discordgo.InteractionApplicationCommand {
		data := e.Data.(*discordgo.ApplicationCommandInteractionData)

		if command, ok := c.commands[data.Name]; ok {
			go command.Handler(s, e)
		}
	} else if e.Type == discordgo.InteractionMessageComponent {
		data := e.Data.(*discordgo.MessageComponentInteractionData)

		if component, ok := c.components[data.CustomID]; ok {
			go component.Handler(s, e)
		}
	}
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
