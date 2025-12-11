import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createStaff(dto: any) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const staff = await this.prisma.adminUser.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        roleId: dto.roleId,
      },
      include: { role: true },
    });

    return { message: 'สร้างพนักงานสำเร็จ', staff: { ...staff, password: undefined } };
  }

  async getAllStaff() {
    const staff = await this.prisma.adminUser.findMany({
      include: { role: { include: { permissions: true } } },
    });

    return staff.map(({ password, ...rest }) => rest);
  }

  async createRole(dto: any) {
    const role = await this.prisma.adminRole.create({
      data: {
        name: dto.name,
        description: dto.description,
        permissions: {
          connect: dto.permissionIds?.map((id: number) => ({ id })),
        },
      },
      include: { permissions: true },
    });

    return { message: 'สร้างบทบาทสำเร็จ', role };
  }

  async getRoles() {
    return this.prisma.adminRole.findMany({
      include: { permissions: true, _count: { select: { adminUsers: true } } },
    });
  }

  async createPermission(dto: any) {
    const permission = await this.prisma.permission.create({ data: dto });
    return { message: 'สร้างสิทธิ์สำเร็จ', permission };
  }

  async getPermissions() {
    return this.prisma.permission.findMany({ orderBy: { module: 'asc' } });
  }
}
