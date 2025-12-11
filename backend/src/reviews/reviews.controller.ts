import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  createReview(@Body() dto: any) {
    return this.reviewsService.createReview(dto);
  }

  @Get('item/:itemId')
  getItemReviews(@Param('itemId') itemId: string, @Query() query: any) {
    return this.reviewsService.getItemReviews(+itemId, query);
  }

  @Get('user/:userId')
  getUserReviews(@Param('userId') userId: string) {
    return this.reviewsService.getUserReviews(+userId);
  }
}
