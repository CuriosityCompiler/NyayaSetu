import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { configValidationSchema } from './config/config.validation';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RightsModule } from './rights/rights.module';
import { LegalAidModule } from './legal-aid/legal-aid.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { AppController } from './app.controller';
import { RateLimitStorageModule } from './common/rate-limit-storage.module';
import { RedisThrottlerStorage } from './common/redis-throttler.storage';

@Module({
  imports: [
    // Environment validation & global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),

    ThrottlerModule.forRootAsync({
      imports: [RateLimitStorageModule],
      inject: [ConfigService, RedisThrottlerStorage],
      useFactory: (
        configService: ConfigService,
        redisStorage: RedisThrottlerStorage,
      ) => ({
        errorMessage: 'Too many requests. Please wait before trying again.',
        throttlers: [
          {
            name: 'short',
            ttl: 60_000,
            limit: 120,
          },
        ],
        ...(configService.get<string>('REDIS_URL')
          ? { storage: redisStorage }
          : {}),
      }),
    }),

    RateLimitStorageModule,
    PrismaModule,
    AuthModule,
    RightsModule,
    LegalAidModule,
    ChatModule,
    AdminModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
