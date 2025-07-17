import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateBy } from "class-validator";

export class CreateDevLogDto {
  @IsString()
  @IsUUID('7', { message: "Invalid Project ID" })
  @IsNotEmpty({ message: "Project is required" })
  projectId: string

  @IsString()
  @IsUUID('7', { message: "Invalid Task ID" })
  @IsNotEmpty({ message: "Task is required" })
  taskId: string

  @IsNotEmpty({ message: "Total hour is required" })
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