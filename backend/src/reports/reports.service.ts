import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getRevenueReport(query: any) {
    const { startDate, endDate } = query;

    const where: any = {};
    if (startDate) where.createdAt = { gte: new Date(startDate) };
    if (endDate) where.createdAt = { ...where.createdAt, lte: new Date(endDate) };

    const transactions = await this.prisma.paymentTransaction.findMany({
      where: { status: 'SUCCESS', ...where },
      include: { invoice: { include: { rentalOrder: true } } },
    });

    const totalRevenue = transactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    return { totalRevenue, transactions: transactions.length, data: transactions };
  }

  async getRentalReport(query: any) {
    const { startDate, endDate, status } = query;

    const where: any = {};
    if (startDate) where.createdAt = { gte: new Date(startDate) };
    if (endDate) where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
    if (status) where.status = status;

    const rentals = await this.prisma.rentalOrder.findMany({
      where,
      include: { items: true, user: { select: { profile: true } } },
    });

    return { total: rentals.length, rentals };
  }

  async getItemUtilization(query: any) {
    const items = await this.prisma.item.findMany({
      include: {
        rentalItems: { include: { rentalOrder: { select: { status: true } } } },
        _count: { select: { rentalItems: true } },
      },
    });

    const utilization = items.map((item) => ({
      id: item.id,
      name: item.name,
      totalRentals: item._count.rentalItems,
      utilizationRate: (item._count.rentalItems / item.stock) * 100,
    }));

    return utilization;
  }

  async getCustomerReport() {
    const users = await this.prisma.user.findMany({
      include: {
        _count: { select: { rentals: true, reviews: true } },
        rentals: { select: { totalPrice: true } },
      },
    });

    const customers = users.map((user) => ({
      id: user.id,
      email: user.email,
      totalRentals: user._count.rentals,
      totalSpent: user.rentals.reduce((sum, r) => sum + parseFloat(r.totalPrice.toString()), 0),
      reviews: user._count.reviews,
    }));

    return customers.sort((a, b) => b.totalSpent - a.totalSpent);
  }

  async getDashboard() {
    const [totalUsers, totalItems, totalRentals, totalRevenue, pendingReturns] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.item.count({ where: { isActive: true } }),
      this.prisma.rentalOrder.count(),
      this.prisma.paymentTransaction.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
      }),
      this.prisma.return.count({ where: { status: 'PENDING_INSPECTION' } }),
    ]);

    return {
      totalUsers,
      totalItems,
      totalRentals,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingReturns,
    };
  }
}
