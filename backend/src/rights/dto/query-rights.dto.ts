import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContentLocale } from '@prisma/client';

export class QueryRightsDto {
  @ApiPropertyOptional({ description: 'Search keywords across title, summary, and provisions' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Filter by category (e.g. Fundamental Rights, Consumer, Labor, Women, Criminal)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by jurisdiction (e.g. IN for central, KA for Karnataka, DL for Delhi)' })
  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @ApiPropertyOptional({ enum: ContentLocale, default: 'en', description: 'Content language' })
  @IsOptional()
  @IsEnum(ContentLocale)
  locale?: ContentLocale;
}
