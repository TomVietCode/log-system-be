import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  AddMemberToProjectDto,
  CreateProjectDto,
  createTaskDto,
  UpdateProjectDto,
  UpdateTaskDto,
} from './dtos';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/dtos';
import { UserDecorator } from 'src/auth/decorators/user.decorator';
import { User } from 'src/user/dtos';

@Controller('projects')
@UseGuards(JWTAuthGuard, RoleGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(UserRole.LEADER)
  async createProject(
    @UserDecorator('id') userId: string,
    @Body() dto: CreateProjectDto,
  ) {
    const result = await this.projectService.createProject(userId, dto);

    return {
      data: result,
    };
  }

  @Get()
  @Roles(UserRole.LEADER, UserRole.DEV)
  async getProjects(@UserDecorator() user: User) {
    const result = await this.projectService.getProjects(user.id);

    return {
      data: result,
    };
  }

  @Post('add-member')
  @Roles(UserRole.LEADER)
  async addMemberToProject(@Body() dto: AddMemberToProjectDto) {
    const result = await this.projectService.addMemberToProject(
      dto.projectId,
      dto.userIds,
    );

    return {
      data: result,
    };
  }


  @Get(':projectId')
  @Roles(UserRole.LEADER, UserRole.DEV)
  async getProject(@Param('projectId') projectId: string) {
    const result = await this.projectService.getProject(projectId);

    return {
      data: result,
    };
  }

  @Patch(':projectId')
  @Roles(UserRole.LEADER)
  async updateProject(
    @Param('projectId') projectId: string,
    @UserDecorator('id') userId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    const result = await this.projectService.updateProject(
      projectId,
      userId,
      dto,
    );

    return {
      data: result,
    };
  }

  @Delete(':projectId') 
  @Roles(UserRole.LEADER)
  async deleteProject(@Param('projectId') projectId: string) {
    const result = await this.projectService.deleteProject(projectId);

    return {
      data: result,
    };
  }

  @Post(':projectId/tasks')
  @Roles(UserRole.LEADER, UserRole.DEV)
  async createProjectTasks(@Param('projectId') projectId: string, @Body() dto: createTaskDto[]) {
    const result = await this.projectService.createProjectTasks(projectId, dto);

    return {
      data: result,
    };
  }

  @Get(':projectId/tasks')
  @Roles(UserRole.LEADER, UserRole.DEV)
  async getProjectTasks(@Param('projectId') projectId: string) {
    const result = await this.projectService.getProjectTasks(projectId);

    return {
      data: result,
    };
  }

  @Get(':projectId/members')
  @Roles(UserRole.LEADER, UserRole.DEV)
  async getProjectMembers(@Param('projectId') projectId: string) {
    const result = await this.projectService.getProjectMembers(projectId);

    return {
      data: result,
    };
  }
}
