import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/dtos';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserNotifications(user: User) {
    return this.prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async sendReminder(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const notification = await this.prisma.notification.create({
      data: { userId, title: 'Nhắc nhở', content: `Bạn chưa nhập Devlog cho dự án ${project.name}` },
    });

    return { success: true }
  }
}
