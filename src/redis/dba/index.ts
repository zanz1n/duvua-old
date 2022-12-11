import Redis from "ioredis"
import { TicketDb } from "./Ticket"

export class RedisDba {
    private redis: Redis
    public ticket: TicketDb

    constructor(redis: Redis) {
        this.redis = redis
        this.ticket = new TicketDb(this.redis)
    }
}
