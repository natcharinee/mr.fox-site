import { Module } from '@nestjs/common';
import { WalletModule } from '../wallet/wallet.module';
import { ChatsController } from './chats.controller';

@Module({
  imports: [WalletModule],
  controllers: [ChatsController],
})
export class ChatsModule {}
