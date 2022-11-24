export const c = new (class {
    public black = (string: string) => {
        return `\x1b[40m${string}\x1b[0m`
    }
    public red = (string: string) => {
        return `\x1b[41m${string}\x1b[0m`
    }
    public green = (string: string) => {
        return `\x1b[42m${string}\x1b[0m`
    }
    public yellow = (string: string) => {
        return `\x1b[43m${string}\x1b[0m`
    }
    public blue = (string: string) => {
        return `\x1b[44m${string}\x1b[0m`
    }
    public magenta = (string: string) => {
        return `\x1b[45m${string}\x1b[0m`
    }
    public cyan = (string: string) => {
        return `\x1b[46m${string}\x1b[0m`
    }
    public white = (string: string) => {
        return `\x1b[47m\x1b[30m${string}\x1b[0m`
    }
})
