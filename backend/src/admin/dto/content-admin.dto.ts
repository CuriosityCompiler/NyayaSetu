import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentLocale, ReviewDecision } from '@prisma/client';

export class CreateTopicDto {
  @ApiProperty({ example: 'right-to-education' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ example: 'Fundamental Rights' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ example: 'IN' })
  @IsString()
  @IsNotEmpty()
  jurisdiction!: string;

  @ApiProperty({
    example:
      'Right of Children to Free and Compulsory Education Act, 2009 (RTE Act)',
  })
  @IsString()
  @IsNotEmpty()
  sourceReference!: string;

  @ApiProperty({ enum: ContentLocale, default: 'en' })
  @IsEnum(ContentLocale)
  locale!: ContentLocale;

  @ApiProperty({ example: 'Right to Free and Compulsory Education in India' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example:
      'Every child between the ages of 6 and 14 has a fundamental right to free and compulsory education under Article 21A of the Indian Constitution.',
  })
  @IsString()
  @IsNotEmpty()
  summary!: string;

  @ApiProperty({
    example:
      'Detailed breakdown of 25% quota in private schools, admission procedures, no screening tests, and grievance channels...',
  })
  @IsString()
  @IsNotEmpty()
  body!: string;

  @ApiPropertyOptional({
    description: 'Trusted government URL when this is an official translation',
    example: 'https://indiacode.nic.in',
  })
  @IsOptional()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  officialSourceUrl?: string;
}

export class ReviewContentDto {
  @ApiProperty({ enum: ReviewDecision, example: ReviewDecision.APPROVED })
  @IsEnum(ReviewDecision)
  decision!: ReviewDecision;

  @ApiPropertyOptional({
    example: 'Statutory citations verified against India Code 2009 Act No. 35',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
