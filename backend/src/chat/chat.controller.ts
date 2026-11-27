import { Controller, Post, Body, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatQueryDto, ChatFeedbackDto } from './dto/chat-query.dto';
import { SanitizePipe } from '../common/pipes/sanitize.pipe';

@ApiTags('Multilingual Guided Assistant')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('query')
  @Throttle({ short: { limit: 30, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Submit query to NyayaMitra legal awareness assistant',
  })
  @ApiResponse({
    status: 200,
    description: 'Grounded legal explanation with citations',
  })
  async query(@Body(SanitizePipe) dto: ChatQueryDto, @Req() req: any) {
    const userId = req.user?.id || undefined;
    return this.chatService.handleQuery(dto, userId);
  }

  @Post('feedback')
  @ApiOperation({
    summary: 'Submit anonymous satisfaction feedback for a chat session',
  })
  async feedback(@Body(SanitizePipe) dto: ChatFeedbackDto) {
    return this.chatService.saveFeedback(dto);
  }
}
