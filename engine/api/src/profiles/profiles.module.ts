import { Module } from '@nestjs/common';
import { CreatorsController, ProfilesController } from './profiles.controller';

@Module({
  controllers: [ProfilesController, CreatorsController],
})
export class ProfilesModule {}
