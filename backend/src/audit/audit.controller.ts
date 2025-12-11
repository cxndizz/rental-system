import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  getAuditLogs(@Query() query: any) {
    return this.auditService.getAuditLogs(query);
  }

  @Post()
  createLog(@Body() dto: any) {
    return this.auditService.createLog(dto);
  }
}
