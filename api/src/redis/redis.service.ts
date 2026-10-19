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

    async lockSet(key, token, msecond=10000){
      return this.redis.set(key, token, 'PX', msecond, 'NX');
    }

    async get(key: string): Promise<any> {
        return this.redis.get(key);
    }

    async del(key: string) {
        return this.redis.del(key);
    }

    async addRateLimit(key: string, limit: number, windowSecond: number):Promise<boolean>{
        const script = `
        local count = redis.call('INCR', KEYS[1])
        local limit = ARGV[1]
        if count == 1 then 
         redis.call('EXPIRE', KEYS[1], ARGV[2])
         return 1 
         end
        if count > limit then 
        return 0
        else return 1
        end`;
        const count = await this.redis.incr(key);
        if(count === 1){
            await this.redis.expire(key, windowSecond);
            return true;
        }
        if(count > limit){
            return false;
        }
        return true;
    }

    async eval(lockKey, lockToken){
    const script = `if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1]) else 
    return 0 
    end `;
       return this.redis.eval(script, 1, lockKey, lockToken);
    }
}
