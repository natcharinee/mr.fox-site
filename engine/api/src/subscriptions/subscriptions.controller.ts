import { Body, Controller, Get, Post } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';
import { creatorSettings, subscriptions } from '../database/schema';
import { WalletService } from '../wallet/wallet.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly database: DatabaseService,
    private readonly wallet: WalletService,
  ) {}

  @Post()
  async subscribe(
    @CurrentUser() user: JwtPayload,
    @Body() body: { creatorId: number; period: 'monthly' | 'quarterly' | 'yearly' },
  ) {
    const [settings] = await this.database.db
      .select()
      .from(creatorSettings)
      .where(eq(creatorSettings.userId, body.creatorId))
      .limit(1);

    const amount = settings?.subPriceMonthly ?? 99;
    const months = body.period === 'yearly' ? 12 : body.period === 'quarterly' ? 3 : 1;
    const total = amount * months;

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    await this.wallet.splitPayment(
      'subscription',
      body.creatorId,
      user.sub,
      total,
      `sub:${body.creatorId}`,
    );

    const [sub] = await this.database.db
      .insert(subscriptions)
      .values({
        visitorId: user.sub,
        creatorId: body.creatorId,
        period: body.period,
        amount: total,
        expiresAt,
      })
      .returning();

    return sub;
  }

  @Get('my')
  my(@CurrentUser() user: JwtPayload) {
    return this.database.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.visitorId, user.sub));
  }
}
