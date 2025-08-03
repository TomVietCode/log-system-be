import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, createTaskDto, Task, UpdateProjectDto, UpdateTaskDto } from './dtos';
import { v7 } from 'uuid';
import { getDayRange } from 'src/helper/date';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createProject(userId: string, dto: CreateProjectDto) {
    const existingProject = await this.prisma.project.findFirst({
      where: { name: dto.name }
    })

    if (existingProject) {
      throw new BadRequestException('Project with this name already exists')
    }

    dto.memberIds.push(userId)

    const projectId = v7()
    const project = await this.prisma.project.create({
      data: { id: projectId, name: dto.name, description: dto.description }
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

    const projectTask = dto.tasks.map(task => ({ id: v7(), projectId, name: task.name }))
    await this.prisma.task.createMany({ data: projectTask })
    
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
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            tasks: true,
            ProjectMembers: true
          } 
        },
        ProjectMembers: {
          select: {
            logDate: true,
            user: {
              select: {
                id: true,
                employeeCode: true,
                fullName: true,
                role: true
              }
            }
          }
        }
      }
    })

    const response = projects.map(project => {
      const members = project.ProjectMembers.map(member => {
        const { logDate, user } = member
        return {
          ...user,
          logDate
        }
      })
      const { ProjectMembers, ...rest } = project
      return {
        ...rest,
        members
      }
    })

    return response
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

  async getProject(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        description: true,
        tasks: {
          select: {
            id: true,
            name: true
          }
        },
        ProjectMembers: {
          select: {
            user: true
          }
        }
      }
    })

    return project
  }

  async updateTasks(projectId: string, tasks: Task[]) {
    const currentTasks = await this.prisma.task.findMany({
      where: { projectId }
    })
    const existingTasks = tasks.filter(task => task.id)
    const existingTaskIds = existingTasks.map(task => task.id)
    const newTasks = tasks.filter(task => !task.id)

    // Delete tasks that are no longer in the list
    if(existingTaskIds.length > 0) {
      await this.prisma.task.deleteMany({
        where: { projectId, id: { notIn: existingTaskIds } }
      })
    } else {
      await this.prisma.task.deleteMany({
        where: { projectId }
      })
    }


    for(const task of existingTasks) {
      const currentTask = currentTasks.find(t => t.id === task.id)
      if(currentTask!.name !== task.name) {
        await this.prisma.task.update({
          where: { id: task.id },
          data: {
            name: task.name,
            updatedAt: new Date()
          }
        })
      }
    }

    const newTaskData = newTasks.map(task => ({
      id: v7(),
      name: task.name,
      projectId,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    if(newTaskData.length > 0) {
      await this.prisma.task.createMany({
        data: newTaskData
      })
    }

    return true
  }

  async updateProject(projectId: string, userId: string, dto: UpdateProjectDto) {
    const { name, description, memberIds, tasks } = dto
    
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description
      }
    })

    // Update member in project
    if (memberIds && memberIds.length > 0) {
      const currentMembers = await this.prisma.projectMembers.findMany({
        where: { projectId, userId: { not: userId } }
      })

      const currentMemberIds = currentMembers.map(member => member.userId)
      const membersToRemove = currentMemberIds.filter(id => !memberIds.includes(id))
      const membersToAdd = memberIds.filter(id => !currentMemberIds.includes(id))

      if (membersToRemove.length > 0) {
        await this.prisma.projectMembers.deleteMany({
          where: {
            projectId,
            userId: { in: membersToRemove }
          }
        })
      }

      if (membersToAdd.length > 0) {
        await this.prisma.projectMembers.createMany({
          data: membersToAdd.map(userId => ({
            id: v7(),
            projectId,
            userId,
            joinedAt: new Date()
          }))
        })
      }
    }

    await this.updateTasks(projectId, tasks)

    return true
  }

  async deleteProject(projectId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Delete all tasks associated with the project
      await tx.task.deleteMany({
        where: { projectId }
      })

      // Delete all project member relationships
      await tx.projectMembers.deleteMany({
        where: { projectId }
      })

      // Delete the project itself
      await tx.project.delete({
        where: { id: projectId }
      })
      
      return true
    })
  }

  async getProjectMembers(projectId: string) {
    const todayDate = (new Date()).toISOString().split('T')[0];
    const { startOfDay, endOfDay } = getDayRange(todayDate)

    const data = await this.prisma.projectMembers.findMany({
      where: { projectId },
      select: {
        user: {
          select: {
            id: true,
            employeeCode: true,
            fullName: true,
            role: true
          }
        }
      }
    })

    const members = data.map(member => member.user)
    return members
  }
}
