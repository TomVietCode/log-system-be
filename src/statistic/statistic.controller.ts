import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDecorator } from 'src/auth/decorators/user.decorator';
import { User } from 'src/user/dtos';

@Controller('statistics')
@UseGuards(JWTAuthGuard)
export class StatisticController {
  constructor(
    private readonly statisticService: StatisticService
  ) {}

  @Get("dashboard")
  async getDashboardData(@UserDecorator() user: User) {
    const result = await this.statisticService.getDashboardData(user)

    return {
      data: result
    }
  }
}
