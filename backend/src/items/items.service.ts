import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto, UpdateItemDto, CreateCategoryDto, CreateTagDto } from './dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async getAllItems(query: any) {
    const { page = 1, limit = 10, categoryId, search, minPrice, maxPrice } = query;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (categoryId) {
      where.categoryId = +categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay.gte = +minPrice;
      if (maxPrice) where.pricePerDay.lte = +maxPrice;
    }

    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        skip,
        take: +limit,
        include: {
          category: true,
          media: { orderBy: { order: 'asc' } },
          tags: true,
          reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.item.count({ where }),
    ]);

    const itemsWithRating = items.map((item) => ({
      ...item,
      averageRating: item.reviews.length
        ? item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length
        : 0,
    }));

    return {
      items: itemsWithRating,
      pagination: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    };
  }

  async getItem(id: number) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
        media: { orderBy: { order: 'asc' } },
        tags: true,
        reviews: {
          include: { user: { select: { profile: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('ไม่พบข้อมูลสินค้า');
    }

    return item;
  }

  async createItem(dto: CreateItemDto) {
    const item = await this.prisma.item.create({
      data: {
        name: dto.name,
        description: dto.description,
        pricePerDay: dto.pricePerDay,
        stock: dto.stock,
        available: dto.stock,
        categoryId: dto.categoryId,
      },
      include: { category: true },
    });

    return { message: 'สร้างสินค้าสำเร็จ', item };
  }

  async updateItem(id: number, dto: UpdateItemDto) {
    const item = await this.prisma.item.update({
      where: { id },
      data: dto,
      include: { category: true, media: true, tags: true },
    });

    return { message: 'อัปเดตสินค้าสำเร็จ', item };
  }

  async deleteItem(id: number) {
    await this.prisma.item.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'ลบสินค้าสำเร็จ' };
  }

  async getCategories() {
    return this.prisma.itemCategory.findMany({
      where: { isActive: true },
      include: { _count: { select: { items: true } } },
    });
  }

  async createCategory(dto: CreateCategoryDto) {
    const category = await this.prisma.itemCategory.create({
      data: {
        ...dto,
        slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
      },
    });

    return { message: 'สร้างหมวดหมู่สำเร็จ', category };
  }

  async getTags() {
    return this.prisma.itemTag.findMany();
  }

  async createTag(dto: CreateTagDto) {
    const tag = await this.prisma.itemTag.create({
      data: {
        name: dto.name,
        slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
      },
    });

    return { message: 'สร้างแท็กสำเร็จ', tag };
  }

  async addMedia(itemId: number, dto: any) {
    const media = await this.prisma.itemMedia.create({
      data: {
        itemId,
        url: dto.url,
        type: dto.type,
        order: dto.order || 0,
      },
    });

    return { message: 'เพิ่มรูปภาพสำเร็จ', media };
  }
}
