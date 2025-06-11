import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { DevlogModule } from './devlog/devlog.module';
import { APP_GUARD } from '@nestjs/core';
import { JWTAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, ProjectModule, DevlogModule],
  controllers: [AppController],
  providers: [
    AppService, 
    { provide: APP_GUARD, useClass: JWTAuthGuard }
  ],
})
export class AppModule {}
