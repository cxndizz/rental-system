import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, UpdateKYCDto, CreateAddressDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        kyc: true,
        addresses: true,
      },
    });

    if (!user) {
      throw new NotFoundException('ไม่พบข้อมูลผู้ใช้');
    }

    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const updated = await this.prisma.userProfile.update({
      where: { userId },
      data: dto,
    });

    return { message: 'อัปเดตโปรไฟล์สำเร็จ', profile: updated };
  }

  async submitKYC(userId: number, dto: UpdateKYCDto) {
    const kyc = await this.prisma.userKYC.upsert({
      where: { userId },
      create: {
        userId,
        ...dto,
        status: 'PENDING',
      },
      update: dto,
    });

    return { message: 'ส่งข้อมูล KYC สำเร็จ', kyc };
  }

  async getKYC(userId: number) {
    return this.prisma.userKYC.findUnique({
      where: { userId },
    });
  }

  async createAddress(userId: number, dto: CreateAddressDto) {
    const address = await this.prisma.userAddress.create({
      data: {
        userId,
        ...dto,
      },
    });

    return { message: 'เพิ่มที่อยู่สำเร็จ', address };
  }

  async getAddresses(userId: number) {
    return this.prisma.userAddress.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async getAllUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: {
          profile: true,
          kyc: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: users.map(({ password, ...user }) => user),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
