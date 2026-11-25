import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetRequestDto, PasswordResetConfirmDto } from './dto/password-reset.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException('An account with this email address already exists');
    }

    // Argon2id hashing with OWASP recommended parameters
    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        name: dto.name.trim(),
        locale: dto.locale || 'en',
        preferences: {
          create: {
            locale: dto.locale || 'en',
            accessibilitySettings: {},
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        locale: true,
        createdAt: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto, ipAddress: string) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check account lockout per PDR: 5 failed attempts per 15 minutes
    if (user.failedLoginLockedUntil && user.failedLoginLockedUntil > new Date()) {
      const waitMinutes = Math.ceil(
        (user.failedLoginLockedUntil.getTime() - Date.now()) / (1000 * 60)
      );
      throw new UnauthorizedException(
        `Account temporarily locked due to repeated failed attempts. Please try again in ${waitMinutes} minute(s).`
      );
    }

    const isMatch = await argon2.verify(user.passwordHash, dto.password);
    if (!isMatch) {
      const failedCount = user.failedLoginAttempts + 1;
      const shouldLock = failedCount >= 5;
      const lockUntil = shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: shouldLock ? 0 : failedCount,
          failedLoginLockedUntil: lockUntil,
        },
      });

      this.logger.warn(`Failed login attempt #${failedCount} for ${email} from ${ipAddress}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Reset failed counter on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        failedLoginLockedUntil: null,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    const { passwordHash, resetCode, refreshTokenHash, ...safeUser } = user;
    return {
      user: safeUser,
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { success: true, message: 'Logged out successfully' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await argon2.verify(user.refreshTokenHash, refreshToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async requestPasswordReset(dto: PasswordResetRequestDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Always return success message to prevent user enumeration
    if (!user) {
      return {
        message: 'If an account is associated with this email, a verification code has been dispatched.',
      };
    }

    // Generate secure 6-digit code
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash the reset code before storing to protect database breaches
    const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetCode: hashedCode,
        resetCodeExpiry: expiry,
        resetAttempts: 0,
      },
    });

    this.logger.log(`Password reset code generated for ${email}: ${resetCode} (valid for 10m)`);

    return {
      message: 'If an account is associated with this email, a verification code has been dispatched.',
    };
  }

  async confirmPasswordReset(dto: PasswordResetConfirmDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.resetCode || !user.resetCodeExpiry) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    if (new Date() > user.resetCodeExpiry) {
      throw new BadRequestException('Verification code has expired. Please request a new one.');
    }

    if (user.resetAttempts >= 5) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { resetCode: null, resetCodeExpiry: null, resetAttempts: 0 },
      });
      throw new BadRequestException('Too many invalid attempts. Please request a new code.');
    }

    const providedHash = crypto.createHash('sha256').update(dto.code).digest('hex');
    if (providedHash !== user.resetCode) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { resetAttempts: { increment: 1 } },
      });
      throw new BadRequestException('Invalid verification code');
    }

    const newPasswordHash = await argon2.hash(dto.newPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetCode: null,
        resetCodeExpiry: null,
        resetAttempts: 0,
        refreshTokenHash: null, // Revoke active sessions
      },
    });

    return {
      success: true,
      message: 'Password has been successfully updated. You may now sign in with your new password.',
    };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const accessExpiry = this.configService.get<string>('JWT_ACCESS_EXPIRY') || '60m';
    const refreshExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { expiresIn: accessExpiry as any },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role, typ: 'refresh' },
        { expiresIn: refreshExpiry as any },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: accessExpiry,
    };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }
}
