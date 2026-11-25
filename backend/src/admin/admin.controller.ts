import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { CreateTopicDto, ReviewContentDto } from './dto/content-admin.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator';
import { UserRole } from '@prisma/client';
import { SanitizePipe } from '../common/pipes/sanitize.pipe';

@ApiTags('Admin & Editorial Governance')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('content')
  @Roles(UserRole.EDITOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Draft new legal content revision (Editor/Admin)' })
  async createContent(@Body(SanitizePipe) dto: CreateTopicDto, @Req() req: any) {
    return this.adminService.createContent(dto, req.user.id);
  }

  @Post('content/:id/approve')
  @Roles(UserRole.REVIEWER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve or reject draft content (Reviewer/Admin)' })
  async reviewContent(
    @Param('id') id: string,
    @Body(SanitizePipe) dto: ReviewContentDto,
    @Req() req: any,
  ) {
    return this.adminService.reviewContent(id, req.user.id, dto);
  }

  @Get('reviews')
  @Roles(UserRole.REVIEWER, UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Fetch editorial review queue' })
  async getReviews() {
    return this.adminService.getReviewQueue();
  }

  @Get('audit-logs')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'View immutable system audit logs (Admin only)' })
  async getAuditLogs(@Query('limit') limit?: number) {
    return this.adminService.getAuditLogs(limit ? Number(limit) : 100);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER, UserRole.EDITOR)
  @ApiOperation({ summary: 'Admin metrics dashboard overview' })
  async getStats() {
    return this.adminService.getDashboardStats();
  }
}
