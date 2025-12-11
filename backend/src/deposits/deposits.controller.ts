import { Controller, Post, Put, Param, Body } from '@nestjs/common';
import { DepositsService } from './deposits.service';

@Controller('deposits')
export class DepositsController {
  constructor(private depositsService: DepositsService) {}

  @Post(':rentalOrderId')
  holdDeposit(@Param('rentalOrderId') rentalOrderId: string, @Body() dto: any) {
    return this.depositsService.holdDeposit(+rentalOrderId, dto.amount);
  }

  @Put(':id/release')
  releaseDeposit(@Param('id') id: string) {
    return this.depositsService.releaseDeposit(+id);
  }

  @Put(':id/forfeit')
  forfeitDeposit(@Param('id') id: string) {
    return this.depositsService.forfeitDeposit(+id);
  }
}
