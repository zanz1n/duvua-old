package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/bwmarrin/discordgo"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/zanz1n/duvua-bot/music/commands"
	"github.com/zanz1n/duvua-bot/music/events"
	"github.com/zanz1n/duvua-bot/music/providers"
)

var (
	client *discordgo.Session
	config *providers.Config
	endCh  = make(chan os.Signal)
)

func init() {
	log.SetPrefix(fmt.Sprintf("%v - ", os.Getpid()))

	if os.Getenv("APP_ENV") != "production" {
		err := godotenv.Load()

		if err != nil {
			log.Fatalln(err)
		}
	}

	providers.LoadConfigFromEnv()

	config = providers.GetConfig()
}

func main() {
	var err error

	client, err = discordgo.New("Bot " + config.Token)

	if err != nil {
		log.Fatalln(err)
	}

	db, dbConn, err := providers.NewDbProvider(providers.DbProviderParams{
		Uri:          config.DatabseUri,
		SSLMode:      "disable",
		MaxOpenConns: config.MaxOpenConns,
	})

	if err != nil {
		log.Fatalln(err)
	}

	_ = db

	cmdHandler := providers.NewCommandHandler(client)

	client.AddHandler(events.NewReadyListener(cmdHandler))

	cmdHandler.AddCommand(commands.PingCommand())

	err = client.Open()

	if err != nil {
		log.Fatalln(err)
	}

	signal.Notify(endCh, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)

	<-endCh

	log.Println("Closing ...")

	client.Close()
	dbConn.Close()
}
