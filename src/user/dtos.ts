import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDate, IsPhoneNumber } from 'class-validator';

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
  liscencePlate?: string;

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

