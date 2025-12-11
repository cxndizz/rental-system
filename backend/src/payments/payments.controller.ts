import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('invoice/:rentalOrderId')
  createInvoice(@Param('rentalOrderId') rentalOrderId: string) {
    return this.paymentsService.createInvoice(+rentalOrderId);
  }

  @Post('transaction')
  createTransaction(@Body() dto: any) {
    return this.paymentsService.createTransaction(dto);
  }

  @Get('invoice/:id')
  getInvoice(@Param('id') id: string) {
    return this.paymentsService.getInvoice(+id);
  }

  @Post('refund/:invoiceId')
  refundPayment(@Param('invoiceId') invoiceId: string, @Body() dto: any) {
    return this.paymentsService.refundPayment(+invoiceId, dto);
  }
}
