import { Injectable } from '@nestjs/common';
import { getDateRange } from 'src/helper/date';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/dtos';
import { DevlogService } from 'src/devlog/devlog.service';
import { StatisticDto } from './dto';

@Injectable()
export class StatisticService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly devLogService: DevlogService
  ) {}

  async getDashboardData(user: User, month: number, year: number): Promise<StatisticDto> {
    const devLogData = await this.devLogService.getMyDevLogs(user, month, year)

    const projects = await this.prisma.projectMembers.findMany({
      where: {
        userId: user.id
      },
      select: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    const projectIds = projects.map(project => project.project.id)

    const { startDate, endDate } = getDateRange(month, year)
    // get hours by project
    const projectHours = await this.prisma.devLog.groupBy({
      by: ["projectId"],
      where: {
        userId: user.id,
        projectId: { in: projectIds},
        logDate: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        totalHour: true
      }
    })

    const projectData = projects.map(p => {
      const projectHour = projectHours.find(ph => ph.projectId === p.project.id)
      return {
        id: p.project.id,
        name: p.project.name,
        hours: projectHour?._sum.totalHour || 0
      }
    })

    return {
      dailyHoursChart: {
        days: devLogData.days,
        hours: devLogData.totalByDay,
        month: devLogData.month,
        year: devLogData.year
      },
      projectChart: {
        projects: projectData,
      }
    }
  }
}
