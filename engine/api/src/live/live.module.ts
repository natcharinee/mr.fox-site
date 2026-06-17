import { Module } from '@nestjs/common';
import { WalletModule } from '../wallet/wallet.module';
import { LiveController } from './live.controller';

@Module({
  imports: [WalletModule],
  controllers: [LiveController],
})
export class LiveModule {}
