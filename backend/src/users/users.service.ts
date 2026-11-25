import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        locale: true,
        status: true,
        createdAt: true,
        preferences: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return user;
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    if (dto.locale) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { locale: dto.locale },
      });
    }

    const preferences = await this.prisma.userPreferences.upsert({
      where: { userId },
      update: {
        ...(dto.locale ? { locale: dto.locale } : {}),
        ...(dto.accessibilitySettings ? { accessibilitySettings: dto.accessibilitySettings } : {}),
      },
      create: {
        userId,
        locale: dto.locale || 'en',
        accessibilitySettings: dto.accessibilitySettings || {},
      },
    });

    return preferences;
  }

  async deleteAccount(userId: string) {
    // Delete user cascades to preferences and cleans up per PDR data minimization
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      success: true,
      message: 'Your account and personal data have been completely erased.',
    };
  }
}
