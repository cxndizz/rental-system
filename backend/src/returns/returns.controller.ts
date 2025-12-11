import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ReturnsService } from './returns.service';

@Controller('returns')
export class ReturnsController {
  constructor(private returnsService: ReturnsService) {}

  @Post(':rentalOrderId')
  createReturn(@Param('rentalOrderId') rentalOrderId: string) {
    return this.returnsService.createReturn(+rentalOrderId);
  }

  @Get('pending')
  getPendingReturns() {
    return this.returnsService.getPendingReturns();
  }

  @Put(':id/inspect')
  inspectReturn(@Param('id') id: string, @Body() dto: any) {
    return this.returnsService.inspectReturn(+id, dto);
  }

  @Post(':id/damage')
  reportDamage(@Param('id') id: string, @Body() dto: any) {
    return this.returnsService.reportDamage(+id, dto);
  }
}
