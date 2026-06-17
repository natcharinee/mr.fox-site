import { Module } from '@nestjs/common';
import { WalletModule } from '../wallet/wallet.module';
import { CallsController } from './calls.controller';

@Module({
  imports: [WalletModule],
  controllers: [CallsController],
})
export class CallsModule {}
