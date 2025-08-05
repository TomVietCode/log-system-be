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
        userId: user.id,
        logDate
      }
    })

    if (isExist) {
      await this.prisma.devLog.update({
        where: {
          id: isExist.id
        },
        data: {
          totalHour: totalHour + isExist.totalHour
        }
      })
      return isExist
    }

    const newId = v7()
    const devLog = await this.prisma.devLog.create({
      data: {
        id: newId,
        taskId,
        projectId: task.projectId,
        totalHour,
        isOvertime,
        content: content || '',
        logDate,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Update DevLog Date
    await this.prisma.projectMembers.updateMany({
      where: {
        userId: user.id,
        projectId: task.projectId
      },
      data: {
        logDate: new Date()
      }
    })

    return devLog
  }

  async getMyDevLogs(user: User, month?: number, year?: number) {
    const { startDate, endDate, currentMonth, currentYear } = getDateRange(month, year)

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
    
    if (joinedProjects.length === 0) {
      throw new BadRequestException('User is not a member of any project')
    }
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
        userName: user.fullName,
        month,
        year,
        days: [],
        tasks: [],
        totalByDay: [],
        grandTotal: 0
      }
    }

    const daysOfMonth = endDate.getDate() // get total days of month
    const days = Array.from({ length: daysOfMonth }, (_, i) => i + 1) // create array of days of month
    
    //get all devlogs
    const devLogs = await this.prisma.devLog.findMany({
      where: {
        userId: user.id,
        taskId: { in: taskIds },
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
      month: currentMonth,
      year: currentYear,
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

  async exportDevLogs(requester: User, userId: string, month: number, year: number) {
    const data = await this.getUserDevLogs(requester, userId, month, year)
    
    return data
  }

  async getUserDevLogs(requester: User, userId: string, month: number, year: number) {
    const { role, id: requesterId } = requester

    if(role === UserRole.LEADER) {
      const projects = await this.prisma.projectMembers.findMany({
        where: {
          userId: requesterId
        },
        select: {
          projectId: true
        }
      })

      const projectIds = projects.map(project => project.projectId)

      const memberInProject = await this.prisma.projectMembers.findFirst({
        where: {
          projectId: { in: projectIds },
          userId: userId
        },
        select: {
          user: {
            omit: { password: true }
          }
        },
      })

      if(!memberInProject) {
        throw new BadRequestException('User is not a member of any project')
      }
      const { role, ...props } = memberInProject.user

      const memberInfo: User = {
        ...props, 
        role: role as UserRole
      }

      const devLogData = await this.getMyDevLogs(memberInfo, month, year)

      return devLogData
    }

    const userRecord = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      omit: { password: true }
    })

    if(!userRecord) {
      throw new BadRequestException('User not found')
    }

    const user: User = {
      ...userRecord,
      role: userRecord.role as UserRole
    }

    const devLogData = await this.getMyDevLogs(user, month, year)
    return devLogData
  }
}
