import { BadRequestException, Body, Controller, ExecutionContext, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { AddMemberToProjectDto, CreateProjectDto, createTaskDto, UpdateTaskDto } from './dtos';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/dtos';
import { userInfo } from 'os';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('projects')
@UseGuards(JWTAuthGuard, RoleGuard)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService
  ) {}

  @Post("/")
  @Roles(UserRole.LEADER)
  async createProject(@Body() dto: CreateProjectDto) {
    const result = await this.projectService.createProject(dto)
     
    return {
      data: result
    }
  }

  @Get()
  @Roles(UserRole.LEADER, UserRole.DEV)
  async getProjects(@User() user: any) {
    const result = await this.projectService.getProjects(user.id)

    return {
      data: result,
    }
  }

  @Post('add-member')
  @Roles(UserRole.LEADER)
  async addMemberToProject(@Body() dto: AddMemberToProjectDto) {
    const result = await this.projectService.addMemberToProject(dto.projectId, dto.userIds)

    return {
      data: result,
    }
  }

  @Post('tasks')
  @Roles(UserRole.LEADER, UserRole.DEV) 
  async createProjectTask(@Body() dto: createTaskDto) {
    const result = await this.projectService.createProjectTask(dto)

    return {  
      data: result,
    }
  }

  @Get(':projectId/tasks')
  @Roles(UserRole.LEADER, UserRole.DEV)
  async getProjectTasks(@Param('projectId') projectId: string) {
    const result = await this.projectService.getProjectTasks(projectId)

    return {
      data: result,
    }
  }

  @Patch('tasks/:taskId')
  @Roles(UserRole.LEADER)
  async updateTask(
    @Param("taskId") taskId: string,
    @Body() dto: UpdateTaskDto
  ) {
    const result = await this.projectService.updateTask(taskId, dto) 

    return {
      data: result,
    }
  }
}

