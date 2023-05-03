import { ApplicationCommandOptionType, ChatInputApplicationCommandData } from "discord.js";

export const additionalCommands: ChatInputApplicationCommandData[]  = [
    {
        name: "play",
        description: "Toca uma música",
        descriptionLocalizations: { "en-US": "Plays a music" },
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
    },
    {
        name: "queue",
        description: "Mostra informações sobre a playlist",
        descriptionLocalizations: { "en-US": "Shows info about the playlist" },
    },
    {
        name: "pause",
        description: "Pausa a música que está tocando",
        descriptionLocalizations: { "en-US": "Pauses the current playing music" },
    },
    {
        name: "resume",
        description: "Despausa a música que está tocando",
        descriptionLocalizations: { "en-US": "Resumes the current playing music" },
    },
    {
        name: "volume",
        description: "Altera o volume da playlist que está tocando",
        descriptionLocalizations: { "en-US": "Changes the volume of the currently playling playlist" },
        options: [
            {
                name: "target",
                description: "O volume que deseja definir",
                descriptionLocalizations: { "en-US": "The volume you want to set" },
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },
    {
        name: "skip",
        description: "Pula a música que está tocando",
        descriptionLocalizations: { "en-US": "Skips the current playing music" },
    }
];
