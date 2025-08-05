import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { UserDecorator } from 'src/auth/decorators/user.decorator';
import { CreateDevLogDto } from './dtos';
import { DevlogService } from './devlog.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/dtos';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/dtos';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { devLogData, generateDevLogCsv } from 'src/helper/csv';
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
    @Body("month") month: number,
    @Body("year") year: number,
    @Res() res: Response
  ) {
    month = Number(month)
    year = Number(year)

    const results = await Promise.all(
      userIds.map(async (userId) => {
        const devLogsData = await this.devlogService.getUserDevLogs(requester, userId, month, year)
        const csvString = generateDevLogCsv(devLogsData as devLogData)
        return csvString
      })
    )

    const combinedCsv = this.devlogService.combineExportedCsvs(results)
    const fileName = `devlogs_${month}_${year}.csv`

    // set header and download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    res.send(combinedCsv)
  }

  @Get(":userId")
  @UseGuards(RoleGuard)
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
