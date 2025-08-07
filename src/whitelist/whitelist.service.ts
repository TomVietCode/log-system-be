import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WhitelistService {
  constructor(private readonly prisma: PrismaService) {}

  async getWhitelist() {
    return this.prisma.whiteListEmail.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async addWhitelist(domain: string) {
    return this.prisma.whiteListEmail.create({
      data: {
        email: `*@${domain}`,
        domain,
      },
    })
  }

  async updateWhitelist(id: string, domain: string) {
    return this.prisma.whiteListEmail.update({
      where: { id },
      data: { email: `*@${domain}`, domain },
    })
  }

  async deleteWhitelist(id: string) {
    return this.prisma.whiteListEmail.delete({
      where: {
        id,
      },
    })
  }
}
