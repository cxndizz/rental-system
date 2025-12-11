import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto, UpdateRentalStatusDto } from './dto';

@Controller('rentals')
export class RentalsController {
  constructor(private rentalsService: RentalsService) {}

  @Post()
  createRental(@Body() dto: CreateRentalDto) {
    return this.rentalsService.createRental(dto);
  }

  @Get()
  getAllRentals(@Query() query: any) {
    return this.rentalsService.getAllRentals(query);
  }

  @Get('user/:userId')
  getUserRentals(@Param('userId') userId: string, @Query() query: any) {
    return this.rentalsService.getUserRentals(+userId, query);
  }

  @Get(':id')
  getRental(@Param('id') id: string) {
    return this.rentalsService.getRental(+id);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateRentalStatusDto) {
    return this.rentalsService.updateStatus(+id, dto);
  }

  @Get('overdue/all')
  getOverdueRentals() {
    return this.rentalsService.getOverdueRentals();
  }
}
