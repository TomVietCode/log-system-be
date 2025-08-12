import { IsString, IsNotEmpty, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  LEADER = 'LEADER',
  HCNS = 'HCNS',
  DEV = 'DEV',
}

export class RegisterDTO {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @IsString()
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString()
  @IsOptional()
  citizenID: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  role: UserRole;
}

export class LoginDTO {
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  @IsEmail({}, { message: 'Email is not valid' })
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;  

  @IsString()
  @IsOptional()
  citizenID?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  licensePlate?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  personalEmail?: string;

  @IsString()
  @IsOptional()
  dob?: Date; 

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  employeeCode?: string;
}

