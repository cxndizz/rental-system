import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('user/:userId')
  getUserNotifications(@Param('userId') userId: string) {
    return this.notificationsService.getUserNotifications(+userId);
  }

  @Post()
  sendNotification(@Body() dto: any) {
    return this.notificationsService.sendNotification(dto);
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }

  @Post('templates')
  createTemplate(@Body() dto: any) {
    return this.notificationsService.createTemplate(dto);
  }

  @Post('broadcast')
  broadcast(@Body() dto: any) {
    return this.notificationsService.broadcast(dto);
  }
}
