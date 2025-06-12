import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDecorator } from '../auth/decorators/user.decorator';
import { ChangePasswordDto, UpdateUserDto } from './dtos';

@Controller('users')
@UseGuards(JWTAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

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
}
