package cmd

import (
	"errors"
	"sync"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/zanz1n/duvua-bot/shared/logger"
)

type CommandManager struct {
	cmds   map[string]Command
	cmdsMu *sync.RWMutex
}

func NewCommandManager() *CommandManager {
	return &CommandManager{
		cmds:   make(map[string]Command),
		cmdsMu: &sync.RWMutex{},
	}
}

func (cm *CommandManager) Delete(name string) error {
	cm.cmdsMu.Lock()
	defer cm.cmdsMu.Unlock()

	if _, ok := cm.cmds[name]; !ok {
		return errors.New("command does not exist")
	}
	delete(cm.cmds, name)
	return nil
}

func (cm *CommandManager) Add(cmd Command) error {
	cm.cmdsMu.Lock()
	defer cm.cmdsMu.Unlock()

	logger.Info("Command '%s' added", cmd.Key())

	if _, ok := cm.cmds[cmd.Key()]; ok {
		return errors.New("command already exists")
	}
	cm.cmds[cmd.Key()] = cmd

	return nil
}

func (cm *CommandManager) AutoHandle(s *discordgo.Session) {
	s.AddHandler(func(s *discordgo.Session, e *discordgo.InteractionCreate) {
		go cm.Handle(s, e)
	})
}

func (cm *CommandManager) Post(s *discordgo.Session) {
	cmds := []*discordgo.ApplicationCommand{}

	cm.cmdsMu.RLock()
	for _, v := range cm.cmds {
		if appCmd, ok := v.ApplicationCommand(); ok {
			cmds = append(cmds, appCmd)
		}
	}
	cm.cmdsMu.RUnlock()

	// for _, cmd := range cmds {
	// 	_, err := s.ApplicationCommandCreate(s.State.User.ID, "", cmd)

	// 	if err != nil {
	// 		logger.Error("Failed to post command %s: %s", cmd.Name, err.Error())
	// 		ec++
	// 		continue
	// 	}
	// 	i++
	// }

	result, err := s.ApplicationCommandBulkOverwrite(s.State.User.ID, "", cmds)

	if err != nil {
		logger.Error("Something went wrong while posting commands: %s", err.Error())
		return
	}

	i, ec := len(cmds), len(result)

	logger.Info("%v commands posted, %v failed", ec, i-ec)
}

func (cm *CommandManager) Handle(s *discordgo.Session, e *discordgo.InteractionCreate) {
	var (
		cmd Command
		ok  bool
	)
	cm.cmdsMu.RLock()

	if e.Type == discordgo.InteractionApplicationCommand ||
		e.Type == discordgo.InteractionApplicationCommandAutocomplete {
		cmd, ok = cm.cmds[e.ApplicationCommandData().Name]

		if ok && !cmd.Accepts.ApplicationCommand {
			ok = false
		}

	} else if e.Type == discordgo.InteractionMessageComponent {
		cmd, ok = cm.cmds[e.MessageComponentData().CustomID]

		if ok && !cmd.Accepts.MessageComponent {
			ok = false
		}
	} else if e.Type == discordgo.InteractionModalSubmit {
		cmd, ok = cm.cmds[e.ModalSubmitData().CustomID]

		if ok && !cmd.Accepts.ModalSubmit {
			ok = false
		}
	}
	cm.cmdsMu.RUnlock()

	if !ok {
		return
	}
	startTime := time.Now()

	if err := cmd.Handler(s, e); err != nil {
		logger.Error(
			"Exception caught when executing a command %s, took %v - %s",
			cmd.Key(),
			time.Since(startTime),
			err.Error(),
		)
	} else {
		logger.Info(
			"Command %s executed, took %v",
			cmd.Key(),
			time.Since(startTime),
		)
	}
}
