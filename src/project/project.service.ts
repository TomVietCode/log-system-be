import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dtos';
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
}
