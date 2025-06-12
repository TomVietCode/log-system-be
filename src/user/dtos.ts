import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { UserRole } from 'src/auth/dtos';

export interface User {
  id: string
  employeeCode: string
  fullName: string
  dob?: Date | null
  accountNumber?: string | null
  email: string
  phone: string
  citizenID: string
  personalEmail?: string
  liscenePlate?: string | null
  role: UserRole
  createdAt?: Date
  updatedAt?: Date
}


export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  @IsEmail({}, { message: 'Email is not valid' })
  email?: string;

  @IsString()
  @IsOptional()
  citizenID?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  liscencePlate?: string;

  @IsString()
  @IsOptional()
  @IsEmail({}, { message: 'Personal email is not valid' })
  personalEmail?: string;

  @IsString()
  @IsOptional()
  dob?: Date; 

  @IsString()
  @IsOptional()
  accountNumber?: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Old password is required' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}

