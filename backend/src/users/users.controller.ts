import { Controller, Get, Put, Post, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto, UpdateKYCDto, CreateAddressDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile/:id')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(+id);
  }

  @Put('profile/:id')
  updateProfile(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(+id, dto);
  }

  @Post('kyc/:id')
  submitKYC(@Param('id') id: string, @Body() dto: UpdateKYCDto) {
    return this.usersService.submitKYC(+id, dto);
  }

  @Get('kyc/:id')
  getKYC(@Param('id') id: string) {
    return this.usersService.getKYC(+id);
  }

  @Post('addresses/:userId')
  createAddress(@Param('userId') userId: string, @Body() dto: CreateAddressDto) {
    return this.usersService.createAddress(+userId, dto);
  }

  @Get('addresses/:userId')
  getAddresses(@Param('userId') userId: string) {
    return this.usersService.getAddresses(+userId);
  }

  @Get()
  getAllUsers(@Query('page') page: string, @Query('limit') limit: string) {
    return this.usersService.getAllUsers(+page || 1, +limit || 10);
  }
}
