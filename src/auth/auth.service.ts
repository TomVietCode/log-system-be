import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDTO, RegisterDTO, UserRole } from "./dtos";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { v7 } from 'uuid';
import { generateEmployeeCode } from "src/helper/generate";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDTO) {
    try {
      await this.validateWhiteListEmail(registerDto.email);

      const existedEmail = await this.prismaService.user.findFirst({
        where: { email: registerDto.email },
      });

      if (existedEmail) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const id = v7()

      const user = await this.prismaService.user.create({
        data: {
          ...registerDto,
          employeeCode: generateEmployeeCode(4),
          personalEmail: registerDto.email,
          id,
          email: registerDto.email,
          password: hashedPassword,
          role: UserRole.DEV,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const accessToken = this.jwtService.sign({
        id: user.id,
        role: user.role,
      })

      return { accessToken, user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginDto: LoginDTO) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { email: loginDto.email },
      })

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      const accessToken = this.jwtService.sign({
        id: user.id,
        role: user.role,
      })

      return { accessToken, user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validateWhiteListEmail(email: string) {
    const isEmailInWhiteList = await this.prismaService.whiteListEmail.findFirst({
      where: { email },
    });

    if (!isEmailInWhiteList) {
      throw new BadRequestException('Email is not in the white list');
    }
  }
}