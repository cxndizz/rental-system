import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReturnsService {
  constructor(private prisma: PrismaService) {}

  async createReturn(rentalOrderId: number) {
    const returnRecord = await this.prisma.return.create({
      data: {
        rentalOrderId,
        status: 'PENDING_INSPECTION',
      },
      include: {
        rentalOrder: { include: { items: { include: { item: true } }, user: true } },
      },
    });

    await this.prisma.rentalOrder.update({
      where: { id: rentalOrderId },
      data: { status: 'RETURNED' },
    });

    return { message: 'บันทึกการคืนสำเร็จ', return: returnRecord };
  }

  async getPendingReturns() {
    return this.prisma.return.findMany({
      where: { status: 'PENDING_INSPECTION' },
      include: {
        rentalOrder: {
          include: { items: { include: { item: true } }, user: { include: { profile: true } } },
        },
      },
    });
  }

  async inspectReturn(id: number, dto: any) {
    const updated = await this.prisma.return.update({
      where: { id },
      data: {
        status: dto.status,
        inspectedBy: dto.inspectedBy,
        notes: dto.notes,
      },
    });

    return { message: 'ตรวจสอบสำเร็จ', return: updated };
  }

  async reportDamage(returnId: number, dto: any) {
    const damage = await this.prisma.damageReport.create({
      data: {
        returnId,
        description: dto.description,
        penaltyFee: dto.penaltyFee,
        photoUrls: dto.photoUrls || [],
      },
    });

    await this.prisma.return.update({
      where: { id: returnId },
      data: { status: 'DAMAGED' },
    });

    return { message: 'บันทึกความเสียหายสำเร็จ', damage };
  }
}
