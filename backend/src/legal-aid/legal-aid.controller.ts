import { Controller, Get, Header, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LegalAidService } from './legal-aid.service';
import { QueryLegalAidDto } from './dto/query-legal-aid.dto';

@ApiTags('Legal Aid Directory')
@Controller('legal-aid')
export class LegalAidController {
  constructor(private readonly legalAidService: LegalAidService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  @ApiOperation({ summary: 'Search free legal aid directory across India' })
  @ApiResponse({ status: 200, description: 'List of matching legal aid contacts' })
  async findAll(@Query() query: QueryLegalAidDto) {
    return this.legalAidService.findAll(query);
  }

  @Get('states')
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  @ApiOperation({ summary: 'List all Indian states/UTs with registered legal aid authorities' })
  async getStates() {
    return this.legalAidService.getStates();
  }

  @Get('districts')
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  @ApiOperation({ summary: 'List all districts for a given state' })
  @ApiQuery({ name: 'state', required: true, example: 'Karnataka' })
  async getDistricts(@Query('state') state: string) {
    return this.legalAidService.getDistricts(state || '');
  }

  @Get('eligibility')
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  @ApiOperation({ summary: 'Get official NALSA Section 12 free legal aid eligibility criteria' })
  getEligibility() {
    return this.legalAidService.getEligibilityCriteria();
  }

  @Get(':id')
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  @ApiOperation({ summary: 'Get details for a specific legal aid authority' })
  async findById(@Param('id') id: string) {
    return this.legalAidService.findById(id);
  }
}
