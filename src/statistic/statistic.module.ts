import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { DevlogModule } from 'src/devlog/devlog.module';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService],
  imports: [DevlogModule]
})
export class StatisticModule {}
