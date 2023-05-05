package providers

import (
	"fmt"
	"log"
	"os"
	"strconv"
)

type Config struct {
	Token        string
	MaxOpenConns uint8
	DatabseUri   string
}

var config *Config

func GetConfig() *Config {
	return config
}

func LoadConfigFromEnv() {
	config = &Config{}

	if token := os.Getenv("DISCORD_TOKEN"); token == "" {
		log.Fatalln("DISCORD_TOKEN env is required")
	} else {
		config.Token = token
	}

	if databseUri := os.Getenv("DATABASE_URL"); databseUri == "" {
		log.Fatalln("DATABASE_URL env is required")
	} else {
		config.DatabseUri = databseUri
	}

	if maxConns := os.Getenv("MUSIC_MAX_OPEN_CONNS"); maxConns == "" {
		config.MaxOpenConns = 8
	} else {
		maxConnsUInt, err := strconv.ParseUint(maxConns, 10, 0)

		if err != nil {
			log.Fatalln(err)
		}

		if maxConnsUInt > 255 {
			log.Fatalln(fmt.Errorf("MUSIC_MAX_OPEN_CONNS must be a valid unsigned 8 bit integer"))
		}

		config.MaxOpenConns = uint8(maxConnsUInt)
	}
}
