import querryString from "querystring"
import { generate } from "./generateToken.js"
import { isoLanguageString } from "./isoLanguageString.js"

export type TranslatorOptions = {
    from: isoLanguageString
    to: isoLanguageString
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
        let textResult = ""
        const url = `${baseUrl}?${querryString.stringify(data)}`

        const body = await fetch(url, {
            method: "POST"
        }).then(res => res.json())

        body[0].forEach((obj: any) => {
            if (obj[0]) {
                textResult += obj[0]
            }
        })
        return textResult
    }
}
