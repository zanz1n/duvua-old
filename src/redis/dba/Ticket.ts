import Redis from "ioredis"

export type TicketData = {
    id: string
    enabled: boolean
    channelId: string
}

export type TicketUpdateData = {
    enabled?: boolean
    channelId?: string
}

export class TicketDb {
    private redis: Redis
    constructor(redis: Redis) {
        this.redis = redis
    }

    async create(options: TicketData): Promise<TicketData> {
        return this.redis.set(options.id,
            JSON.stringify({ ...options })).then(() => {
            return options
        })
    }

    async updateById(id: string, data: TicketUpdateData): Promise<TicketData | null> {
        const find = await this.redis.get(id)
        if (find) {
            const findData = JSON.parse(find) as TicketData
            const newData: TicketData = {
                channelId: data.channelId ?? findData.channelId,
                enabled: data.enabled ?? findData.enabled,
                id
            }
            return this.redis.set(id, JSON.stringify(newData)).then(() => {
                return newData
            })
        }
        return null
    }

    async deleteById(id: string): Promise<TicketData | null> {
        const find = await this.redis.get(id)
        if (find) {
            const data = JSON.parse(find) as TicketData
            await this.redis.del(id)
            return data
        }
        return null
    }

    async findById(id: string): Promise<TicketData | null> {
        const find = await this.redis.get(id)
        if (find) {
            const data = JSON.parse(find) as TicketData
            return data
        }
        return null
    }
}
