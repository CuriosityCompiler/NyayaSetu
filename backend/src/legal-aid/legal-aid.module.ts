import { Module } from '@nestjs/common';
import { LegalAidController } from './legal-aid.controller';
import { LegalAidService } from './legal-aid.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LegalAidController],
  providers: [LegalAidService],
  exports: [LegalAidService],
})
export class LegalAidModule {}
