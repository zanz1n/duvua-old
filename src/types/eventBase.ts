export type eventBase = {
    name: string
    enabled: boolean
    // eslint-disable-next-line @typescript-eslint/ban-types
    run: Function
}