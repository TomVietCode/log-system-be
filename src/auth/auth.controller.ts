import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dtos';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDTO,
  ) {
    const result = await this.authService.register(registerDto);

    return {
      data: result,
      message: 'User registered successfully',
    };
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDTO,
  ) {
    const result = await this.authService.login(loginDto);

    return {
      data: result,
      message: 'User logged in successfully',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return {
      message: 'User logged out successfully',
    };
  }
}
