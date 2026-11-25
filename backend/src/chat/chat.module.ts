import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LanguageModelService } from './language-model.service';

@Module({
  imports: [PrismaModule],
  controllers: [ChatController],
  providers: [ChatService, LanguageModelService],
  exports: [ChatService],
})
export class ChatModule {}
