export function parseMsIntoFormatData(n: string | number) {
    function interGer(n: number) {
        return n - n % 1
    }
    const timeOut = Number(n)
    const hour = interGer(timeOut / 3600000)
    const minutes = interGer(timeOut / 60000 - hour * 60)
    const seconds = interGer(timeOut / 1000 - minutes * 60 - hour * 3600)

    let formatData = ""

    if (hour != 0) {
        formatData = `${hour}h:${minutes}m:${seconds}s`
    } if (hour == 0 || !hour) {
        formatData = `${minutes}m:${seconds}s`
    } if (minutes == 0) {
        formatData = `${seconds}s`
    }
    return formatData
}
