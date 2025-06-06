import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { AddMemberToProjectDto, CreateProjectDto } from './dtos';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/dtos';

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
     
    return result
  }

  @Post('add-member')
  @Roles(UserRole.LEADER)
  async addMemberToProject(@Body() dto: AddMemberToProjectDto) {
    const result = await this.projectService.addMemberToProject(dto.projectId, dto.userIds)

    return result
  }
}

