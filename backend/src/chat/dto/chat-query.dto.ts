import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatQueryDto {
  @ApiProperty({
    example: 'How do I apply for free legal aid if I cannot afford a lawyer?',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  message!: string;

  @ApiPropertyOptional({ example: 'en', default: 'en' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  locale?: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ example: 'Bengaluru Urban' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @ApiPropertyOptional({
    description: 'Optional anonymous session tracking id',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;
}

export class ChatFeedbackDto {
  @ApiProperty({ example: 'session-id' })
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  rating!: number;

  @ApiPropertyOptional({
    example: 'Very clear explanation and exact helpline provided',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  feedbackText?: string;
}
