import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('revenue')
  getRevenueReport(@Query() query: any) {
    return this.reportsService.getRevenueReport(query);
  }

  @Get('rentals')
  getRentalReport(@Query() query: any) {
    return this.reportsService.getRentalReport(query);
  }

  @Get('items')
  getItemUtilization(@Query() query: any) {
    return this.reportsService.getItemUtilization(query);
  }

  @Get('customers')
  getCustomerReport() {
    return this.reportsService.getCustomerReport();
  }

  @Get('dashboard')
  getDashboard() {
    return this.reportsService.getDashboard();
  }
}
