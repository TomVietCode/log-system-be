import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDecorator } from 'src/auth/decorators/user.decorator';
import { User } from 'src/user/dtos';

@Controller('notifications')
@UseGuards(JWTAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(@UserDecorator() user: User) {
    return this.notificationService.getUserNotifications(user);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }
  
  @Post('send-reminder')
  async sendReminder(@Body() data: { userId: string, projectId: string }) {
    return this.notificationService.sendReminder(
      data.userId,
      data.projectId
    );
  }
}
