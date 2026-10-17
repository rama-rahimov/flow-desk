import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {Redis} from "ioredis";
import dotenv from 'dotenv';
import * as process from "node:process";
dotenv.config();

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly redis: Redis;
    constructor() {
      const prodRedis = process.env.REDIS_URL;
      prodRedis ? this.redis = new Redis(prodRedis) : this.redis = new Redis({ host: '127.0.0.1', port: 6379});
    }

    async onModuleDestroy() {
        await this.redis.quit();
    }

    async set(key: string, value: any): Promise<void> {
        await this.redis.set(key, value);
    }

    async get(key: string): Promise<any> {
        return this.redis.get(key);
    }

    async del(key: string) {
        return this.redis.del(key);
    }
}
