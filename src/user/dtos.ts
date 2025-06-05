import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

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

