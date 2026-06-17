import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';
import { giftStickers, gifts } from '../database/schema';
import { WalletService } from '../wallet/wallet.service';

@Controller('gifts')
export class GiftsController {
  constructor(
    private readonly database: DatabaseService,
    private readonly wallet: WalletService,
  ) {}

  @Get('stickers')
  stickers() {
    return this.database.db.select().from(giftStickers);
  }

  @Post('send')
  async send(
    @CurrentUser() user: JwtPayload,
    @Body() body: { creatorId: number; stickerId: number },
  ) {
    const [sticker] = await this.database.db
      .select()
      .from(giftStickers)
      .where(eq(giftStickers.id, body.stickerId))
      .limit(1);
    if (!sticker) throw new Error('Sticker not found');

    await this.wallet.splitPayment(
      'gift',
      body.creatorId,
      user.sub,
      sticker.price,
      `gift:${body.stickerId}`,
    );

    const [gift] = await this.database.db
      .insert(gifts)
      .values({
        visitorId: user.sub,
        creatorId: body.creatorId,
        stickerId: body.stickerId,
        amount: sticker.price,
      })
      .returning();

    return gift;
  }

  @Get('creator/:creatorId/history')
  history(@Param('creatorId') creatorId: string) {
    return this.database.db
      .select()
      .from(gifts)
      .where(eq(gifts.creatorId, Number(creatorId)))
      .orderBy(desc(gifts.createdAt))
      .limit(50);
  }
}
