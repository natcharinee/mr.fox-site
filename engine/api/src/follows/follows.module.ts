import { Module } from '@nestjs/common';
import { FollowsController } from './follows.controller';

@Module({
  controllers: [FollowsController],
})
export class FollowsModule {}
