import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        profile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
          },
        },
      },
      include: { profile: true },
    });

    const token = this.generateToken(user.id);
    return {
      message: 'ลงทะเบียนสำเร็จ',
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true, kyc: true },
    });

    if (!user) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('บัญชีของคุณถูกระงับ');
    }

    const token = this.generateToken(user.id);
    return {
      message: 'เข้าสู่ระบบสำเร็จ',
      user: this.sanitizeUser(user),
      token,
    };
  }

  async adminLogin(dto: LoginDto) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
      include: { role: { include: { permissions: true } } },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const token = this.generateAdminToken(admin.id);
    return {
      message: 'เข้าสู่ระบบสำเร็จ',
      admin: { ...admin, password: undefined },
      token,
    };
  }

  async refreshToken(refreshToken: string) {
    // TODO: Implement JWT refresh token logic
    return { token: 'new-token' };
  }

  private generateToken(userId: number): string {
    // TODO: Implement JWT token generation
    return `token-${userId}-${Date.now()}`;
  }

  private generateAdminToken(adminId: number): string {
    // TODO: Implement JWT token generation for admin
    return `admin-token-${adminId}-${Date.now()}`;
  }

  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }
}
