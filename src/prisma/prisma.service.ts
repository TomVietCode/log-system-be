import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }
  
  async onModuleInit() {
    try {
      await this.$connect();
      console.log("Connected to database");
    } catch (error) {
      console.error("Error connecting to database", error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log("Disconnected from database");
  }
}