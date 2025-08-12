import { Body, Controller, Get, Patch, Query, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDecorator } from '../auth/decorators/user.decorator';
import { ChangePasswordDto, UpdateUserAdminDto, UpdateUserDto } from './dtos';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/dtos';

@Controller('users')
@UseGuards(JWTAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles(UserRole.HCNS, UserRole.ADMIN, UserRole.LEADER)
  async getUserList(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("role") role: string,
    @Query("q") q?: string,
  ) {
    page = Number(page) || 1
    limit = Number(limit) || 10
    const result = await this.userService.getUserList(page, limit, role, q)

    return {
      data: result
    }
  }
  
  @Get("profile")
  async getProfile(@UserDecorator("id") userId: string) {
    const result = await this.userService.getProfile(userId)
    return {
      data: result,
    }
  }
  
  @Patch("profile")
  async updateProfile(@UserDecorator("id") userId: string, @Body() dto: UpdateUserDto) {
    const result = await this.userService.updateProfile(userId, dto)
    if (!result) {
      return { message: "Failed to update profile" }
    }
    return {
      data: result,
      message: "Profile updated successfully"
    }
  }  

  @Patch("change-password")
  async changePassword(@UserDecorator("id") userId: string, @Body() dto: ChangePasswordDto) {
    const result = await this.userService.changePassword(userId, dto)
    if (!result) {
      return { message: "Failed to change password" }
    }
    return { 
      data: result,
      message: "Password changed successfully"
    }
  }

  @Patch(":userId")
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(@Param("userId") userId: string, @Body() dto: UpdateUserAdminDto) {
    const result = await this.userService.updateUser(userId, dto)
    
    return {
      data: result
    }
  }
}
