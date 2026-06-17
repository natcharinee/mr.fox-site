import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';
import { chatMessages, chats, creatorSettings } from '../database/schema';
import { WalletService } from '../wallet/wallet.service';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly database: DatabaseService,
    private readonly wallet: WalletService,
  ) {}

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.database.db
      .select()
      .from(chats)
      .where(eq(chats.visitorId, user.sub));
  }

  @Post(':creatorId/messages')
  async sendMessage(
    @CurrentUser() user: JwtPayload,
    @Param('creatorId') creatorId: string,
    @Body() body: { content: string },
  ) {
    const cid = Number(creatorId);
    const [settings] = await this.database.db
      .select()
      .from(creatorSettings)
      .where(eq(creatorSettings.userId, cid))
      .limit(1);
    const price = settings?.chatPrice ?? 10;

    await this.wallet.splitPayment(
      'chat',
      cid,
      user.sub,
      price,
      `chat:${creatorId}`,
    );

    let [chat] = await this.database.db
      .select()
      .from(chats)
      .where(eq(chats.creatorId, cid))
      .limit(1);

    if (!chat) {
      [chat] = await this.database.db
        .insert(chats)
        .values({ creatorId: cid, visitorId: user.sub })
        .returning();
    }

    const [msg] = await this.database.db
      .insert(chatMessages)
      .values({
        chatId: chat.id,
        senderId: user.sub,
        content: body.content,
        amountPaid: price,
      })
      .returning();

    return msg;
  }

  @Get(':chatId/messages')
  messages(@Param('chatId') chatId: string) {
    return this.database.db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.chatId, Number(chatId)))
      .orderBy(desc(chatMessages.createdAt));
  }
}
