import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { WhitelistService } from './whitelist.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from 'src/auth/dtos';

@Controller('whitelists')
@UseGuards(JWTAuthGuard)
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  async getWhitelist() {
    const data = await this.whitelistService.getWhitelist()
    return {
      data,
    }
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  async addWhitelist(@Body() body: { domain: string }) {
    const data = await this.whitelistService.addWhitelist(body.domain)
    return {
      data,
    }
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  async updateWhitelist(@Param('id') id: string, @Body() body: { domain: string }) {
    const data = await this.whitelistService.updateWhitelist(id, body.domain)
    return {
      data,
    }
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  async deleteWhitelist(@Param('id') id: string) {
    const data = await this.whitelistService.deleteWhitelist(id)
    return {
      data,
    }
  }
}


