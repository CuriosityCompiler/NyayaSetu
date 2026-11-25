import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerStorage } from '@nestjs/throttler';
import Redis from 'ioredis';

interface ThrottlerStorageRecord {
  totalHits: number;
  timeToExpire: number;
}

@Injectable()
export class RedisThrottlerStorage
  implements ThrottlerStorage, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisThrottlerStorage.name);
  private readonly client?: Redis;
  private initialization?: Promise<void>;

  constructor(configService: ConfigService) {
    const redisUrl = configService.get<string>('REDIS_URL');
    if (redisUrl) {
      this.client = new Redis(redisUrl, {
        lazyConnect: true,
        connectTimeout: 5_000,
        maxRetriesPerRequest: 1,
        retryStrategy: (attempt) => (attempt <= 5 ? attempt * 200 : null),
      });
    }
  }

  async onModuleInit(): Promise<void> {
    if (!this.client) return;

    if (!this.initialization) {
      this.initialization = this.initializeClient();
    }
    await this.initialization;
  }

  private async initializeClient(): Promise<void> {
    if (!this.client) return;

    this.client.on('error', (error: Error) => {
      this.logger.error('Redis rate-limit storage error', error.stack);
    });
    if (this.client.status === 'wait') {
      await this.client.connect();
    }
    await this.client.ping();
  }

  onModuleDestroy(): void {
    this.client?.disconnect();
  }

  async checkReady(): Promise<void> {
    if (this.client) await this.client.ping();
  }

  async increment(key: string, ttl: number): Promise<ThrottlerStorageRecord> {
    if (!this.client) {
      throw new Error('Redis rate-limit storage was used without a Redis connection');
    }

    const result = await this.client.eval(
      `local hits = redis.call('INCR', KEYS[1])
       local ttl = redis.call('PTTL', KEYS[1])
       if ttl < 0 then
         redis.call('PEXPIRE', KEYS[1], ARGV[1])
         ttl = tonumber(ARGV[1])
       end
       return { hits, ttl }`,
      1,
      `nyayasetu:throttle:${key}`,
      String(ttl),
    );

    if (!Array.isArray(result) || result.length !== 2) {
      throw new Error('Redis returned an invalid rate-limit counter result');
    }

    const totalHits = Number(result[0]);
    const timeToExpire = Math.max(0, Math.ceil(Number(result[1]) / 1000));
    if (!Number.isSafeInteger(totalHits) || !Number.isFinite(timeToExpire)) {
      throw new Error('Redis returned invalid rate-limit counter values');
    }

    return { totalHits, timeToExpire };
  }
}
