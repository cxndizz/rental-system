import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createInvoice(rentalOrderId: number) {
    const rental = await this.prisma.rentalOrder.findUnique({
      where: { id: rentalOrderId },
    });

    if (!rental) {
      throw new Error('ไม่พบข้อมูลคำสั่งเช่า');
    }

    const invoiceNumber = `INV-${Date.now()}`;
    const taxAmount = parseFloat(rental.totalPrice.toString()) * 0.07; // 7% VAT
    const totalAmount = parseFloat(rental.totalPrice.toString()) + taxAmount;

    const invoice = await this.prisma.invoice.create({
      data: {
        rentalOrderId,
        invoiceNumber,
        amount: rental.totalPrice,
        taxAmount,
        totalAmount,
        status: 'UNPAID',
      },
    });

    return { message: 'สร้างใบแจ้งหนี้สำเร็จ', invoice };
  }

  async createTransaction(dto: any) {
    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        invoiceId: dto.invoiceId,
        transactionId: `TXN-${Date.now()}`,
        amount: dto.amount,
        method: dto.method,
        status: dto.status || 'SUCCESS',
        gateway: dto.gateway,
        gatewayResponse: dto.gatewayResponse,
      },
    });

    if (transaction.status === 'SUCCESS') {
      await this.prisma.invoice.update({
        where: { id: dto.invoiceId },
        data: { status: 'PAID', paidAt: new Date() },
      });
    }

    return { message: 'บันทึกการชำระเงินสำเร็จ', transaction };
  }

  async getInvoice(id: number) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        rentalOrder: { include: { items: { include: { item: true } }, user: true } },
        transactions: true,
      },
    });
  }

  async refundPayment(invoiceId: number, dto: any) {
    const refundTxn = await this.prisma.paymentTransaction.create({
      data: {
        invoiceId,
        transactionId: `REFUND-${Date.now()}`,
        amount: dto.amount * -1,
        method: 'REFUND',
        status: 'SUCCESS',
      },
    });

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'REFUNDED' },
    });

    return { message: 'คืนเงินสำเร็จ', transaction: refundTxn };
  }
}
