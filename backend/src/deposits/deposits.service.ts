import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepositsService {
  constructor(private prisma: PrismaService) {}

  async holdDeposit(rentalOrderId: number, amount: number) {
    const deposit = await this.prisma.deposit.create({
      data: {
        rentalOrderId,
        amount,
        status: 'HOLD',
      },
    });

    return { message: 'วางมัดจำสำเร็จ', deposit };
  }

  async releaseDeposit(id: number) {
    const deposit = await this.prisma.deposit.update({
      where: { id },
      data: {
        status: 'RELEASED',
        releasedAt: new Date(),
      },
    });

    return { message: 'คืนมัดจำสำเร็จ', deposit };
  }

  async forfeitDeposit(id: number) {
    const deposit = await this.prisma.deposit.update({
      where: { id },
      data: { status: 'FORFEITED' },
    });

    return { message: 'ริบมัดจำสำเร็จ', deposit };
  }
}
