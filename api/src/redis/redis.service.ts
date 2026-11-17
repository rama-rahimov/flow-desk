import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import * as process from 'node:process';
dotenv.config();

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;
  constructor() {
    const prodRedis = process.env.REDIS_URL;
    this.redis = prodRedis
      ? new Redis(prodRedis)
      : new Redis({ host: 'redis', port: 6379 });
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async lockSet(
    key: string,
    token: string,
    msecond = 10000,
  ): Promise<string | null> {
    return this.redis.set(key, token, 'PX', msecond, 'NX');
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string) {
    return this.redis.del(key);
  }

  async addRateLimit(
    key: string,
    limit: number,
    windowSecond: number,
  ): Promise<number> {
    const script = `
        local count = redis.call('INCR', KEYS[1])
        local limit = tonumber(ARGV[1])
        if count == 1 then 
         redis.call('EXPIRE', KEYS[1], tonumber(ARGV[2]))
        end
        if count > limit then 
        return 0
        else return 1
        end`;
    return Number(await this.redis.eval(script, 1, key, limit, windowSecond));
  }

  async eval(lockKey: string, lockToken: string): Promise<number> {
    const script = `if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1]) else 
    return 0 
    end `;
    return Number(await this.redis.eval(script, 1, lockKey, lockToken));
  }
}
