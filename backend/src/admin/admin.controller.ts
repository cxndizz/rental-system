import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('staff')
  createStaff(@Body() dto: any) {
    return this.adminService.createStaff(dto);
  }

  @Get('staff')
  getAllStaff() {
    return this.adminService.getAllStaff();
  }

  @Post('roles')
  createRole(@Body() dto: any) {
    return this.adminService.createRole(dto);
  }

  @Get('roles')
  getRoles() {
    return this.adminService.getRoles();
  }

  @Post('permissions')
  createPermission(@Body() dto: any) {
    return this.adminService.createPermission(dto);
  }

  @Get('permissions')
  getPermissions() {
    return this.adminService.getPermissions();
  }
}
