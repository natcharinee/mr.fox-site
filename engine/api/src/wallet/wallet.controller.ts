import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  balance(@CurrentUser() user: JwtPayload) {
    return this.walletService.getBalance(user.sub);
  }

  @Get('transactions')
  transactions(@CurrentUser() user: JwtPayload) {
    return this.walletService.getTransactions(user.sub);
  }

  @Post('topup')
  topup(
    @CurrentUser() user: JwtPayload,
    @Body() body: { amount: number; idempotencyKey?: string },
  ) {
    return this.walletService.topup(
      user.sub,
      body.amount,
      body.idempotencyKey,
    );
  }

  @Post('payout/request')
  requestPayout(
    @CurrentUser() user: JwtPayload,
    @Body() body: { amount: number },
  ) {
    return { message: 'Payout request submitted (KYC required)', ...body };
  }
}
