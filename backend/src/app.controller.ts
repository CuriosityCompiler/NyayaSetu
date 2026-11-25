import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';
import { RedisThrottlerStorage } from './common/redis-throttler.storage';

@ApiTags('System & Health')
@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisStorage: RedisThrottlerStorage,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Liveness and readiness health probe' })
  async healthCheck() {
    await this.prisma.$queryRaw`SELECT 1`;
    await this.redisStorage.checkReady();

    return {
      status: 'UP',
      service: 'NyayaSetu Legal Aid & Rights Awareness Backend',
      version: '1.0.0',
      nationalHelpline: '15100',
      timestamp: new Date().toISOString(),
    };
  }
}
