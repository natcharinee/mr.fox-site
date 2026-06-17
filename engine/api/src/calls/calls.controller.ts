import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';
import { calls, creatorSettings } from '../database/schema';
import { WalletService } from '../wallet/wallet.service';

@Controller('calls')
export class CallsController {
  constructor(
    private readonly database: DatabaseService,
    private readonly wallet: WalletService,
  ) {}

  @Post()
  async start(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      creatorId: number;
      type: 'voice' | 'video';
      minutes: number;
    },
  ) {
    const [settings] = await this.database.db
      .select()
      .from(creatorSettings)
      .where(eq(creatorSettings.userId, body.creatorId))
      .limit(1);

    const pricePerMin =
      body.type === 'voice'
        ? (settings?.voicePrice ?? 20)
        : (settings?.videoPrice ?? 50);
    const amount = pricePerMin * body.minutes;

    await this.wallet.splitPayment(
      'call',
      body.creatorId,
      user.sub,
      amount,
      `call:${body.type}`,
    );

    const [call] = await this.database.db
      .insert(calls)
      .values({
        type: body.type,
        creatorId: body.creatorId,
        visitorId: user.sub,
        pricePerMin,
        amount,
        status: 'active',
      })
      .returning();

    return {
      call,
      signaling: `wss://engine.mrfox.app/calls/${call.id}`,
      turn: process.env.TURN_URL ?? 'turn:localhost:3478',
    };
  }

  @Post(':id/end')
  end(@Param('id') id: string, @Body() body: { durationSec: number }) {
    return this.database.db
      .update(calls)
      .set({
        status: 'completed',
        durationSec: body.durationSec,
      })
      .where(eq(calls.id, Number(id)));
  }

  @Get('history')
  history(@CurrentUser() user: JwtPayload) {
    return this.database.db
      .select()
      .from(calls)
      .where(eq(calls.visitorId, user.sub));
  }
}
