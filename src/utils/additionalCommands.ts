import { ApplicationCommandOptionType, ChatInputApplicationCommandData } from "discord.js"

export const additionalCommands: ChatInputApplicationCommandData[]  = [
    {
        name: "play",
        description: "Toca uma música do youtube",
        descriptionLocalizations: { "en-US": "Plays a music from youtube" },
        options: [
            {
                name: "song",
                description: "A url ou o nome do som que deseja pesquisar",
                descriptionLocalizations: { "en-US": "The url or name of the song you want to play" },
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "stop",
        description: "Para o som que está tocando e limpa a playlist",
        descriptionLocalizations: { "en-US": "Stops the current song and cleans the playlist" },
    },
    {
        name: "track",
        description: "Mostra informações sobre o som que está tocando",
        descriptionLocalizations: { "en-US": "Shows info about the current playing song" },
    }
]
