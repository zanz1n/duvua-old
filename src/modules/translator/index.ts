import querryString from "querystring"

interface generateTokenNamespaceType { generate(text: string): { name: string, value: string } }
// eslint-disable-next-line @typescript-eslint/no-var-requires
const generateTokenNamespace = require("./generateToken.js") as generateTokenNamespaceType

const { generate } = generateTokenNamespace

export type isoLanguage = 
    "auto"    |
    "af"      |
    "sq"      |
    "am"      |
    "ar"      |
    "hy"      |
    "az"      |
    "eu"      |
    "be"      |
    "bn"      |
    "bs"      |
    "bg"      |
    "ca"      |
    "ceb"     |
    "ny"      |
    "zh-cn"   |
    "zh-tw"   |
    "co"      |
    "hr"      |
    "cs"      |
    "da"      |
    "nl"      |
    "en"      |
    "eo"      |
    "et"      |
    "tl"      |
    "fi"      |
    "fr"      |
    "fy"      |
    "gl"      |
    "ka"      |
    "de"      |
    "el"      |
    "gu"      |
    "ht"      |
    "ha"      |
    "haw"     |
    "iw"      |
    "hi"      |
    "hmn"     |
    "hu"      |
    "is"      |
    "ig"      |
    "id"      |
    "ga"      |
    "it"      |
    "ja"      |
    "jw"      |
    "kn"      |
    "kk"      |
    "km"      |
    "ko"      |
    "ku"      |
    "ky"      |
    "lo"      |
    "la"      |
    "lv"      |
    "lt"      |
    "lb"      |
    "mk"      |
    "mg"      |
    "ms"      |
    "ml"      |
    "mt"      |
    "mi"      |
    "mr"      |    
    "mn"      |
    "my"      |
    "ne"      |
    "no"      |
    "ps"      |
    "fa"      |
    "pl"      |
    "pt"      |
    "pa"      |
    "ro"      |
    "ru"      |
    "sm"      |
    "gd"      |
    "sr"      |
    "st"      |
    "sn"      |
    "sd"      |
    "si"      |
    "sk"      |
    "sl"      |
    "so"      |
    "es"      |
    "su"      |
    "sw"      |
    "sv"      |
    "tg"      |
    "ta"      |
    "te"      |
    "th"      |
    "tr"      |
    "uk"      |
    "ur"      |
    "uz"      |
    "vi"      |
    "cy"      |
    "xh"      |
    "yi"      |
    "yo"      |
    "zu"

export type TranslatorOptions = {
    from: isoLanguage
    to: isoLanguage
}

export class Translator {
    async translate(text: string, options: TranslatorOptions): Promise<string> {
        const baseUrl = "https://translate.google.com/translate_a/single"
        const token = await generate(text)
        const data = {
            client: "gtx",
            sl: options.from,
            tl: options.to,
            hl: options.to,
            dt: [ "at", "bd", "ex", "ld", "md", "qca", "rw", "rm", "ss", "t" ],
            ie: "UTF-8",
            oe: "UTF-8",
            otf: 1,
            ssel: 0,
            tsel: 0,
            kc: 7,
            q: text,
            [token.name]: token.value
        }
        
        const url = `${baseUrl}?${querryString.stringify(data)}`
        return fetch(url, {
            method: "POST"
        })
            .then(res => res.json())
            .then((data) => {
                return data[0][0][0] as string
            })
    }
}
