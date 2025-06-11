import { Module } from '@nestjs/common';
import { DevlogService } from './devlog.service';
import { DevlogController } from './devlog.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DevlogService],
  controllers: [DevlogController],
  exports: [DevlogService]
})
export class DevlogModule {}
