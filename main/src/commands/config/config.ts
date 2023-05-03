import { Welcome } from "@prisma/client";
import { CacheService } from "services/RedisService.js";

export async function refreshCache(redis: CacheService, data: Welcome) {
    redis.set(`welcome-${data.guildDcId}`, JSON.stringify(data), "EX", 120);
}
