import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryLegalAidDto {
  @ApiPropertyOptional({ description: 'Filter by Indian State or Union Territory' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Filter by District within the state' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ description: 'Search keyword across authority name, address, or district' })
  @IsOptional()
  @IsString()
  q?: string;
}
