export class DuvuaQueue<T> {
    private items: T[]
    constructor() {
        this.items = []
    }

    public enqueue = (item: T) => this.items.push(item)

    public dequeue = () => this.isEmpty() ? null : this.items.shift()!

    public isEmpty = () => this.items.length === 0

    public getAll = () => this.items
}

export class QueueManager<T> {
    public queues: Map<string, DuvuaQueue<T>>
    constructor() {
        this.queues = new Map<string, DuvuaQueue<T>>()
    }

    public createQueue = (guildId: string): DuvuaQueue<T> => {
        const queue = new DuvuaQueue<T>()
        this.queues.set(guildId, queue)
        return queue
    }

    public getQueue = (guildId: string) => this.queues.get(guildId) ?? null
}
