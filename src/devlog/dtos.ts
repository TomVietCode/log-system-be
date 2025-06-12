import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateBy } from "class-validator";

export class CreateDevLogDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID('7', { message: "Invalid ID" })
  taskId: string

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  totalHour: number

  @IsBoolean()
  isOvertime: boolean

  @IsString()
  @IsOptional()
  content?: string

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ValidateBy({
    name: 'isLogDateValid',
    validator: {
      validate(value: Date) {
        const today = new Date()
        return value <= today
      },
      defaultMessage: () => "Log date cannot be in the future"
    }
  })
  logDate: Date
} 