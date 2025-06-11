import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDevLogDto } from './dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { v7 } from 'uuid';

@Injectable()
export class DevlogService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createDevLog(user: any, dto: CreateDevLogDto) {
    const { projectId, taskId, totalHour, isOvertime, content, logDate } = dto

    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId
      }
    })

    if (!project) {
      throw new BadRequestException('Project not found')
    }

    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
        projectId
      }
    })

    if (!task) {
      throw new BadRequestException('Task not found')
    }

    const isExist = await this.prisma.devLog.findFirst({
      where: {
        projectId, 
        taskId,
        logDate,
        userId: user.id
      }
    })

    if (isExist) {
      throw new BadRequestException('Dev log already exists')
    }
    const newId = v7()
    const devLog = await this.prisma.devLog.create({
      data: {
        id: newId,
        projectId,
        taskId,
        totalHour,
        isOvertime,
        content: content || '',
        logDate,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return devLog
  }
}
