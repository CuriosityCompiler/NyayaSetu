import { Module } from '@nestjs/common';
import { RightsController } from './rights.controller';
import { RightsService } from './rights.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RightsController],
  providers: [RightsService],
  exports: [RightsService],
})
export class RightsModule {}
