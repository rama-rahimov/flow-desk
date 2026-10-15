import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {Redis} from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly redis: Redis;
    constructor() {
        this.redis = new Redis({
            host: '127.0.0.1', port: 6379
        });
    }

    async onModuleDestroy() {
        await this.redis.quit();
    }
}
