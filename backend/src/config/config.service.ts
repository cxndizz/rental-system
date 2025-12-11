import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  async getAllConfigs() {
    return this.prisma.systemConfig.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async getConfig(key: string) {
    return this.prisma.systemConfig.findUnique({
      where: { key },
    });
  }

  async updateConfig(key: string, value: string) {
    const config = await this.prisma.systemConfig.upsert({
      where: { key },
      create: { key, value, category: 'GENERAL' },
      update: { value },
    });

    return { message: 'อัปเดตการตั้งค่าสำเร็จ', config };
  }
}
