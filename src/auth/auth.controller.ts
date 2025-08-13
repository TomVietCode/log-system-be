import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO, RegisterDTO } from "./dtos";
import { Public } from "./decorators/public.decorator";
import { response, Response } from "express";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register') 
  async register(@Body() registerDto: RegisterDTO, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(registerDto);

    response.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      path: '/'
    }) 
    
    return {
      data: result,
      message: 'User registered successfully',
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDTO, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(loginDto);

    response.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      path: '/'
    })

    return {
      data: result,
      message: 'User logged in successfully',
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    })

    return {
      message: 'User logged out successfully',
    }
  }

  @Public()
  @Get('check')
  async checkAuth(@Req() request: Request) {
    if ((request as any).user) {
      return {
        isAuthenticated: true,
        user: (request as any).user,
        message: 'User is authenticated',
      }
    }

    return {
      isAuthenticated: false,
      user: null,
      message: 'User is not authenticated',
    }
  }
}