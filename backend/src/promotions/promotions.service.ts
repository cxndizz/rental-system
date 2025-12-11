import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async getActivePromotions() {
    const now = new Date();
    return this.prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });
  }

  async createPromotion(dto: any) {
    const promotion = await this.prisma.promotion.create({ data: dto });
    return { message: 'สร้างโปรโมชันสำเร็จ', promotion };
  }

  async createCoupon(dto: any) {
    const coupon = await this.prisma.coupon.create({ data: dto });
    return { message: 'สร้างคูปองสำเร็จ', coupon };
  }

  async validateCoupon(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('ไม่พบคูปอง');
    }

    const now = new Date();
    const isValid =
      coupon.status === 'ACTIVE' &&
      coupon.usedCount < coupon.maxUses &&
      coupon.startDate <= now &&
      coupon.endDate >= now;

    return { valid: isValid, coupon };
  }

  async createCampaign(dto: any) {
    const campaign = await this.prisma.campaign.create({ data: dto });
    return { message: 'สร้างแคมเปญสำเร็จ', campaign };
  }
}
