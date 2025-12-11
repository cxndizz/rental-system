import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(dto: any) {
    const review = await this.prisma.review.create({
      data: {
        userId: dto.userId,
        itemId: dto.itemId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: { select: { profile: true } },
        item: { select: { name: true } },
      },
    });

    return { message: 'เพิ่มรีวิวสำเร็จ', review };
  }

  async getItemReviews(itemId: number, query: any) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { itemId },
        skip,
        take: +limit,
        include: { user: { select: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { itemId } }),
    ]);

    const avgRating = await this.prisma.review.aggregate({
      where: { itemId },
      _avg: { rating: true },
    });

    return {
      reviews,
      averageRating: avgRating._avg.rating || 0,
      pagination: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) },
    };
  }

  async getUserReviews(userId: number) {
    return this.prisma.review.findMany({
      where: { userId },
      include: { item: { select: { name: true, media: { take: 1 } } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
