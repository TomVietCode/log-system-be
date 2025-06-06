import { BadRequestException, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, createTaskDto, UpdateTaskDto } from './dtos';
import { v7 } from 'uuid';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createProject(dto: CreateProjectDto) {
    const existingProject = await this.prisma.project.findFirst({
      where: { name: dto.name }
    })

    if (existingProject) {
      throw new BadRequestException('Project with this name already exists')
    }

    const projectId = v7()
    const project = await this.prisma.project.create({
      data: { id: projectId, name: dto.name }
    })

    if (dto.memberIds && dto.memberIds.length > 0) {
      await this.prisma.projectMembers.createMany({
        data: dto.memberIds.map(userId => ({
          id: v7(),
          projectId,
          userId,
          joinedAt: new Date()
        }))
      })
    }

    // get all members in project
    const members = await this.prisma.projectMembers.findMany({
      where: { projectId },
      select: {
        userId: true
      }
    })
    return { ...project, members }
  }

  async getProjects(userId: string) {

    const projects = await this.prisma.project.findMany({
      where: {
        ProjectMembers: {
          some: {
            userId
          }
        }
      },
    })

    return projects
  }

  async addMemberToProject(projectId: string, memberIds: string[]) {
    // Check if project exists
    const project = await this.prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      throw new NotFoundException('Project not found')
    }

    // Check if member is already in project
    const existingMembers = await this.prisma.projectMembers.findMany({
      where: {
        projectId,
        userId: { in: memberIds }
      }
    })

    if (existingMembers.length > 0) {
      throw new BadRequestException('Some members are already in the project')
    }
    // Add new members to project
    await this.prisma.projectMembers.createMany({
      data: memberIds.map(userId => ({
        id: v7(),
        projectId,
        userId,
        joinedAt: new Date()
      })) 
    })

    return { success: true }
  }

  async createProjectTask(dto: createTaskDto) {
    const { name, projectId } = dto

    // Check if project exists
    const project = await this.prisma.project.findUnique({ where: { id: projectId } })
    if (!project) {
      throw new NotFoundException('Project not found')
    }
    
    // Check if task name is exists
    const existingTask = await this.prisma.task.findFirst({
      where: { name, projectId }
    })

    if (existingTask) {
      throw new BadRequestException('Task with this name already exists')
    }

    // Create task
    const taskId = v7()
    const task = await this.prisma.task.create({
      data: {
        id: taskId,
        projectId,
        name,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })  

    return task
  }

  async getProjectTasks(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { projectId }
    })
    
    return tasks
  }

  async updateTask(taskId: string, dto: UpdateTaskDto) {
    const { name } = dto

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: { name, updatedAt: new Date() } 
    })

    return task
  }
}
