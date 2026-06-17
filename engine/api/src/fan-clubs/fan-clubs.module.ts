import { Module } from '@nestjs/common';
import { FanClubsController } from './fan-clubs.controller';

@Module({
  controllers: [FanClubsController],
})
export class FanClubsModule {}
