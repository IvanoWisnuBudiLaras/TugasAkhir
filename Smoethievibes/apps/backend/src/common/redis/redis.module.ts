import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        const nodeEnv = configService.get('NODE_ENV') || 'development';
        
        return new Redis({
          host: redisConfig?.host || 'localhost',
          port: redisConfig?.port || 6379,
          password: redisConfig?.password || undefined,
          db: redisConfig?.db || 0,
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: nodeEnv === 'development' ? 0 : 3,
          retryDelayOnFailure: nodeEnv === 'development' ? 0 : 100,
          enableOfflineQueue: nodeEnv !== 'development',
          lazyConnect: true,
          keepAlive: 30000,
          family: 4,
          keyPrefix: 'smoethievibes:',
        } as any);
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}