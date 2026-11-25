import { IsOptional, IsString, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ example: 'hi' })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional({ example: { highContrast: true, fontSize: 'large', reducedMotion: false } })
  @IsOptional()
  @IsObject()
  accessibilitySettings?: Record<string, any>;
}
