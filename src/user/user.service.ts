import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto, UpdateUserAdminDto, UpdateUserDto } from './dtos';
import * as bcrypt from 'bcrypt'
import { UserRole } from 'src/auth/dtos';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserList(page: number = 1, limit: number = 10, role: string = "all", q?: string) {
    const skip = (page - 1) * limit

    const baseWhere = role === "all" ? {} : { role: role as UserRole }

    // Accent-insensitive search by using mode: 'insensitive' and OR on fields
    const queryWhere = q
      ? {
          OR: [
            { fullName: { contains: q } },
            { email: { contains: q } },
            { employeeCode: { contains: q } },
          ],
        }
      : {}

    const where = { ...baseWhere, ...queryWhere }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          employeeCode: true,
          fullName: true,
          role: true,
          email: true,
        },
      }),
      this.prisma.user.count({ where }),
    ])

    return { users, total }
  }

  async updateUser(userId: string, dto: UpdateUserAdminDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true }
    })

    if(!user) {
      throw new NotFoundException("User not found")
    }
    
    // Check if email exists
    if (dto.email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: { email: dto.email, id: { not: userId } }
      });
      
      if (existingEmail) {
        throw new BadRequestException("Email already exists");
      }
      
      // Validate whitelist email if email is being updated
      await this.validateWhiteListEmail(dto.email);
    }
    
    if(dto.password && dto.password.length > 0) {
      dto.password = await bcrypt.hash(dto.password, 10)
    } else {
      delete dto.password
    }

    const result = await this.prisma.user.update({
      where: { id: userId },
      data: dto
    })

    return result
  }
  
  async validateWhiteListEmail(email: string) {
    // Extract domain from email
    const emailDomain = email.split('@')[1];
    
    // Check if the exact email or domain is in whitelist
    const emailMatch = await this.prisma.whiteListEmail.findFirst({
      where: { OR: [{ email }, { domain: emailDomain }] },
    });
    
    // If neither the exact email nor the domain is in the whitelist
    if (!emailMatch) {
      throw new BadRequestException('Email is not in the white list');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true }
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  async updateProfile(userId: string, dto: UpdateUserDto): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    //find existing email or personal email that different from current user
    const existingEmail = await this.prisma.user.findFirst({
      where: {
        OR: [
          { personalEmail: dto.personalEmail, id: { not: userId } }
        ]
      }
    })

    if (existingEmail) {
      throw new BadRequestException("Email or personal email already exists")
    }
    
    //update user
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        dob: dto.dob ? new Date(dto.dob) : undefined,
        updatedAt: new Date()
      }
    })

    return true
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    // check old password
    const isPasswordMatch = await bcrypt.compare(dto.oldPassword, user.password)
    if (!isPasswordMatch) {
      throw new BadRequestException("Old password is incorrect")
    }
    const isNewPasswordTheSame = await bcrypt.compare(dto.newPassword, user.password)
    if (isNewPasswordTheSame) {
      throw new BadRequestException("New password cannot be the same as the old password")
    }

    // update password
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: await bcrypt.hash(dto.newPassword, 10)
      }
    })

    return true
  }
}
