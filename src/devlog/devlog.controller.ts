import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators/user.decorator';
import { CreateDevLogDto } from './dtos';
import { DevlogService } from './devlog.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('devlogs')
@UseGuards(JWTAuthGuard)
export class DevlogController {
  constructor(
    private readonly devlogService: DevlogService
  ){}
  @Post()
  async createDevLog(@User() user: any, @Body() dto: CreateDevLogDto) {
    const result = await this.devlogService.createDevLog(user, dto)

    return {
      data: result,
    }
  }
}
