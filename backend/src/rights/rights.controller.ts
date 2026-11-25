import {
  Controller,
  Get,
  Header,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RightsService } from './rights.service';
import { QueryRightsDto } from './dto/query-rights.dto';
import { ContentLocale } from '@prisma/client';

@ApiTags('Legal Rights Library')
@Controller('rights')
export class RightsController {
  constructor(private readonly rightsService: RightsService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  @ApiOperation({ summary: 'List and search approved legal rights guides' })
  @ApiResponse({ status: 200, description: 'List of matching legal rights guides' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: QueryRightsDto) {
    return this.rightsService.findAll(query);
  }

  @Get('categories')
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  @ApiOperation({ summary: 'Get list of active legal topics categories' })
  async getCategories() {
    return this.rightsService.getCategories();
  }

  @Get(':slug')
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  @ApiOperation({ summary: 'Get detailed legal guide by slug with verified citations' })
  @ApiParam({ name: 'slug', example: 'right-to-information-rti' })
  async findBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: ContentLocale,
  ) {
    return this.rightsService.findBySlug(slug, locale);
  }
}
