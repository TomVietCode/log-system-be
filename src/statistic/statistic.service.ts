import { Injectable } from '@nestjs/common';
import { getCurrentDate, getDateRange } from 'src/helper/date';
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

  async getDashboardData(user: User): Promise<StatisticDto> {
    const { currentMonth, currentYear } = getCurrentDate()
    const { days, totalByDay } = await this.devLogService.getMyDevLogs(user, currentMonth, currentYear)

    return {
      year: currentYear,
      month: currentMonth,
      daysInMonth: days,
      hours: totalByDay
    }
  }
}
