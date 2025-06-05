import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { ChangePasswordDto, UpdateUserDto } from './dtos';

@Controller('users')
@UseGuards(JWTAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get("profile")
  async getProfile(@User("id") userId: string) {
    return this.userService.getProfile(userId)
  }

  @Patch("profile")
  async updateProfile(@User("id") userId: string, @Body() dto: UpdateUserDto) {
    const result = await this.userService.updateProfile(userId, dto)
    if (!result) {
      return { message: "Failed to update profile" }
    }
    return { message: "Profile updated successfully" }
  }  

  @Patch("change-password")
  async changePassword(@User("id") userId: string, @Body() dto: ChangePasswordDto) {
    const result = await this.userService.changePassword(userId, dto)
    if (!result) {
      return { message: "Failed to change password" }
    }
    return { message: "Password changed successfully" }
  }
}
