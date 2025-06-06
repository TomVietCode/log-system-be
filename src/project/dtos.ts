import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  name: string;

  @IsArray()
  @IsOptional()
  memberIds: string[];
}

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  name: string;
}

export class AddMemberToProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @IsArray()
  @IsNotEmpty({ message: 'User IDs are required' })
  userIds: string[];
}

export class createTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Task name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Task name is required' })
  name: string;
}