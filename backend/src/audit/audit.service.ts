import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async getAuditLogs(query: any) {
    const { page = 1, limit = 50, module, userId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (module) where.module = module;
    if (userId) where.userId = +userId;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: +limit,
        include: { user: { select: { email: true, profile: true } } },
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) },
    };
  }

  async createLog(dto: any) {
    const log = await this.prisma.auditLog.create({
      data: {
        action: dto.action,
        module: dto.module,
        userId: dto.userId,
        details: dto.details,
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
      },
    });

    return log;
  }
}
