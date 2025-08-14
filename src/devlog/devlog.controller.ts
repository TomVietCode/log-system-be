import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { UserDecorator } from 'src/auth/decorators/user.decorator';
import { CreateDevLogDto } from './dtos';
import { DevlogService } from './devlog.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/dtos';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/dtos';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Response } from 'express';

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
  async getMyDevLogs(
    @UserDecorator() user: User, 
    @Query("month") month: number, 
    @Query("year") year: number
  ) {
    const result = await this.devlogService.getMyDevLogs(user, month, year)

    return {
      data: result
    }
  }
  
  @Get('missing')
  @UseGuards(RoleGuard)
  @Roles(UserRole.LEADER)
  async getDevWithoutLogs(@UserDecorator() user: User, @Query("date") date: string) {
    const result = await this.devlogService.getDevWithoutLogs(user, date)

    return {
      data: result
    }
  }

  @Post("export")
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.HCNS)
  async exportDevLogs(
    @UserDecorator() requester: User,
    @Body("userIds") userIds: string[],
    @Res() res: Response
  ) {    
    const result = await this.devlogService.exportDevLogs(requester, userIds)
    
    const fileName = 'devlog_data.csv'
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
    res.send(result)
  }

  @Get(":userId")
  @UseGuards(RoleGuard)
  @Roles(UserRole.LEADER, UserRole.DEV, UserRole.HCNS)
  async getUserDevLogs(
    @UserDecorator() requester: User, 
    @Param("userId") userId: string, 
    @Query("month") month: number, 
    @Query("year") year: number
  ) {
    if(requester.role === UserRole.DEV) {
      userId = requester.id
    }

    const result = await this.devlogService.getUserDevLogs(requester, userId, month, year)

    return {
      data: result
    }
  }
}
