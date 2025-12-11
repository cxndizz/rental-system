import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalDto, UpdateRentalStatusDto } from './dto';

@Injectable()
export class RentalsService {
  constructor(private prisma: PrismaService) {}

  async createRental(dto: CreateRentalDto) {
    // Generate order number
    const orderNumber = `RNT-${Date.now()}`;

    const rental = await this.prisma.rentalOrder.create({
      data: {
        userId: dto.userId,
        orderNumber,
        totalPrice: dto.totalPrice,
        depositAmount: dto.depositAmount || 0,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        status: 'PENDING',
        items: {
          create: dto.items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            priceAtRent: item.priceAtRent,
          })),
        },
      },
      include: {
        items: { include: { item: true } },
        user: { include: { profile: true } },
      },
    });

    return { message: 'สร้างคำสั่งเช่าสำเร็จ', rental };
  }

  async getAllRentals(query: any) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [rentals, total] = await Promise.all([
      this.prisma.rentalOrder.findMany({
        where,
        skip,
        take: +limit,
        include: {
          user: { include: { profile: true } },
          items: { include: { item: true } },
          invoice: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rentalOrder.count({ where }),
    ]);

    return {
      rentals,
      pagination: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    };
  }

  async getUserRentals(userId: number, query: any) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [rentals, total] = await Promise.all([
      this.prisma.rentalOrder.findMany({
        where,
        skip,
        take: +limit,
        include: {
          items: { include: { item: { include: { media: true } } } },
          invoice: true,
          return: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rentalOrder.count({ where }),
    ]);

    return { rentals, pagination: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) } };
  }

  async getRental(id: number) {
    const rental = await this.prisma.rentalOrder.findUnique({
      where: { id },
      include: {
        user: { include: { profile: true } },
        items: { include: { item: { include: { media: true } } } },
        invoice: { include: { transactions: true } },
        return: { include: { damageReport: true } },
        deposit: true,
        coupon: true,
      },
    });

    if (!rental) {
      throw new NotFoundException('ไม่พบข้อมูลการเช่า');
    }

    return rental;
  }

  async updateStatus(id: number, dto: UpdateRentalStatusDto) {
    const rental = await this.prisma.rentalOrder.update({
      where: { id },
      data: { status: dto.status, notes: dto.notes },
      include: { items: true, user: { include: { profile: true } } },
    });

    return { message: 'อัปเดตสถานะสำเร็จ', rental };
  }

  async getOverdueRentals() {
    const now = new Date();
    const rentals = await this.prisma.rentalOrder.findMany({
      where: {
        endDate: { lt: now },
        status: { in: ['APPROVED', 'ON_RENT'] },
      },
      include: {
        user: { include: { profile: true } },
        items: { include: { item: true } },
      },
      orderBy: { endDate: 'asc' },
    });

    return { rentals, count: rentals.length };
  }
}
