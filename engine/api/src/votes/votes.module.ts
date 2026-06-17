import { Module } from '@nestjs/common';
import { WalletModule } from '../wallet/wallet.module';
import { VotesController } from './votes.controller';

@Module({
  imports: [WalletModule],
  controllers: [VotesController],
})
export class VotesModule {}
