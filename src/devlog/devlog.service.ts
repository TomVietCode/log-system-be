import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDevLogDto } from './dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { v7 } from 'uuid';
import { getDateRange, getDayRange } from 'src/helper/date';
import { User } from 'src/user/dtos';
import { UserRole } from 'src/auth/dtos';

@Injectable()
export class DevlogService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createDevLog(user: User, dto: CreateDevLogDto) {
    const { taskId, totalHour, isOvertime, content, logDate } = dto

    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId
      }
    })

    if (!task) {
      throw new BadRequestException('Task not found')
    }

    const isExist = await this.prisma.devLog.findFirst({
      where: {
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

  async getMyDevLogs(user: User, month: number, year: number) {
    const { startDate, endDate } = getDateRange(month, year)
    // get all project id that user is member of
    const joinedProjects = await this.prisma.projectMembers.findMany({
      where: {
        userId: user.id
      },
      select: {
        projectId: true
      }
    })
    const projectIds = joinedProjects.map(project => project.projectId)

    // Get all tasks of all projects
    const tasks = await this.prisma.task.findMany({
      where: {
        projectId: { in: projectIds }
      },
      select: {
        id: true,
        name: true,
        projectId: true
      }
    })
    const taskIds = tasks.map(task => task.id)

    if(projectIds.length === 0 || taskIds.length === 0) {
      return {
        days: [],
        tasks: [],
        totalByDay: [],
        totalByTask: [],
        grandTotal: []
      }
    }

    const daysOfMonth = endDate.getDate() // get total days of month
    const days = Array.from({ length: daysOfMonth }, (_, i) => i + 1) // create array of days of month
    
    //get all devlogs
    const devLogs = await this.prisma.devLog.findMany({
      where: {
        taskId: { in: taskIds},
        logDate: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        logDate: true,
        taskId: true,
        totalHour: true,
      }
    })

    // create task response structure
    const tasksResponse = tasks.map(task => {
      const hoursByDay = new Array(daysOfMonth).fill(0)

      // Fill hours for each day
      devLogs
        .filter(log => log.taskId === task.id)
        .forEach(log => {
          const dayIndex = log.logDate.getDate() - 1 // convert to 0-based index
          hoursByDay[dayIndex] += log.totalHour
        })
      
      const totalHoursByTask = hoursByDay.reduce((sum, hour) => sum + hour, 0)

      return {
        taskId: task.id,
        taskName: task.name,
        projectId: task.projectId,
        hoursByDay,
        totalHoursByTask
      }
    })

    // total hours by day array
    const totalByDay = new Array(daysOfMonth).fill(0)
    // fill total hours by day
    tasksResponse.forEach(task => {
      task.hoursByDay.forEach((hour, dayIndex)=> {
        totalByDay[dayIndex] += hour
      })
    })

    const grandTotal = totalByDay.reduce((sum, hour) => sum + hour, 0)

    return {
      userName: user.fullName,
      month,
      year,
      days,
      tasks: tasksResponse,
      totalByDay,
      grandTotal
    }
  }

  async getDevWithoutLogs(user: User, date: string) {
    const projects = await this.prisma.projectMembers.findMany({
      where: {
        userId: user.id
      },
      select: {
        projectId: true
      }
    })

    const projectIds = projects.map(project => project.projectId)

    const projectMembers = await this.prisma.projectMembers.findMany({
      where: {
        projectId: { in: projectIds },
      },
      select: {
        user: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true,
            role: true
          }
        }
      },
      distinct: ["userId"]
    })

    const { startOfDay, endOfDay } = getDayRange(date)

    const devWithLogs = await this.prisma.devLog.findMany({
      where: {
        logDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        user: {
          role: UserRole.DEV
        }
      },
      select: {
        userId: true
      },
      distinct: ["userId"]
    })

    const devWithLogIds = devWithLogs.map(dev => dev.userId)

    const devWithoutLogs = projectMembers
      .filter(dev => !devWithLogIds.includes(dev.user.id) && dev.user.role === UserRole.DEV)
      .map(member => member.user)

    return {
      totalDevWithoutLogs: devWithoutLogs.length,
      date,
      devs: devWithoutLogs
    }
  }
}
