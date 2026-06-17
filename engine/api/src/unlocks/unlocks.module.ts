import { Module } from '@nestjs/common';
import { WalletModule } from '../wallet/wallet.module';
import { UnlocksController } from './unlocks.controller';

@Module({
  imports: [WalletModule],
  controllers: [UnlocksController],
})
export class UnlocksModule {}
