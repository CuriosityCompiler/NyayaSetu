import { Controller, Get, Patch, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { SanitizePipe } from '../common/pipes/sanitize.pipe';

@ApiTags('User Account & Preferences')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile and preferences' })
  async getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('me/preferences')
  @ApiOperation({ summary: 'Update user locale and accessibility preferences' })
  async updatePreferences(@Req() req: any, @Body(SanitizePipe) dto: UpdatePreferencesDto) {
    return this.usersService.updatePreferences(req.user.id, dto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Self-delete account and erase associated data (Right to Erasure)' })
  async deleteAccount(@Req() req: any) {
    return this.usersService.deleteAccount(req.user.id);
  }
}
