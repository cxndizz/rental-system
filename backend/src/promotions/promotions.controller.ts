import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private promotionsService: PromotionsService) {}

  @Get()
  getActivePromotions() {
    return this.promotionsService.getActivePromotions();
  }

  @Post()
  createPromotion(@Body() dto: any) {
    return this.promotionsService.createPromotion(dto);
  }

  @Post('coupons')
  createCoupon(@Body() dto: any) {
    return this.promotionsService.createCoupon(dto);
  }

  @Get('coupons/:code')
  validateCoupon(@Param('code') code: string) {
    return this.promotionsService.validateCoupon(code);
  }

  @Post('campaigns')
  createCampaign(@Body() dto: any) {
    return this.promotionsService.createCampaign(dto);
  }
}
