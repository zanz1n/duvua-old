import { Service } from "../lib/decorators/Service.js";
import { CacheService } from "./RedisService.js";
import { TicketDb } from "./redis/Ticket.js";

@Service()
export class RedisDbaService {
    public ticket: TicketDb;

    constructor(private readonly redis: CacheService) {
        this.ticket = new TicketDb(redis);
    }
}
