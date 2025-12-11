import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getUserNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async sendNotification(dto: any) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        message: dto.message,
        type: dto.type || 'INFO',
        link: dto.link,
      },
    });

    await this.prisma.notificationLog.create({
      data: {
        userId: dto.userId,
        type: dto.type || 'PUSH',
        subject: dto.title,
        message: dto.message,
        status: 'SENT',
      },
    });

    return { message: 'ส่งการแจ้งเตือนสำเร็จ', notification };
  }

  async markAsRead(id: number) {
    await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return { message: 'อ่านแล้ว' };
  }

  async createTemplate(dto: any) {
    const template = await this.prisma.notificationTemplate.create({ data: dto });
    return { message: 'สร้างเทมเพลตสำเร็จ', template };
  }

  async broadcast(dto: any) {
    const users = await this.prisma.user.findMany({ where: { isActive: true }, select: { id: true } });

    const notifications = await Promise.all(
      users.map((user) =>
        this.prisma.notification.create({
          data: {
            userId: user.id,
            title: dto.title,
            message: dto.message,
            type: dto.type || 'PROMOTION',
          },
        }),
      ),
    );

    return { message: `ส่งการแจ้งเตือนถึง ${users.length} คน`, count: notifications.length };
  }
}
