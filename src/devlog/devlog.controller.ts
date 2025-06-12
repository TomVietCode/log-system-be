import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserDecorator } from 'src/auth/decorators/user.decorator';
import { CreateDevLogDto } from './dtos';
import { DevlogService } from './devlog.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/dtos';

@Controller('devlogs')
@UseGuards(JWTAuthGuard)
export class DevlogController {
  constructor(
    private readonly devlogService: DevlogService
  ){}

  @Post()
  async createDevLog(@UserDecorator() user: User, @Body() dto: CreateDevLogDto) {
    const result = await this.devlogService.createDevLog(user, dto)

    return {
      data: result,
    }
  }

  @Get()
  async getMyDevLogs(@UserDecorator() user: User, @Query("month") month: number, @Query("year") year: number) {
    const result = await this.devlogService.getMyDevLogs(user, month, year)

    return {
      data: result
    }
  }
}
