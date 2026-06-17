import { Controller, Get, Param, Post } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';
import { posts, unlocks } from '../database/schema';
import { WalletService } from '../wallet/wallet.service';

@Controller('unlocks')
export class UnlocksController {
  constructor(
    private readonly database: DatabaseService,
    private readonly wallet: WalletService,
  ) {}

  @Post('posts/:postId')
  async unlockPost(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: string,
  ) {
    const [post] = await this.database.db
      .select()
      .from(posts)
      .where(eq(posts.id, Number(postId)))
      .limit(1);
    if (!post?.isLocked || !post.price) {
      throw new Error('Content not locked');
    }

    await this.wallet.splitPayment(
      'unlock',
      post.creatorId,
      user.sub,
      post.price,
      `unlock:post:${postId}`,
    );

    const [unlock] = await this.database.db
      .insert(unlocks)
      .values({
        visitorId: user.sub,
        postId: Number(postId),
        amount: post.price,
      })
      .returning();

    return unlock;
  }

  @Get('posts/:postId/check')
  async check(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: string,
  ) {
    const [unlock] = await this.database.db
      .select()
      .from(unlocks)
      .where(eq(unlocks.visitorId, user.sub))
      .limit(1);
    return { unlocked: !!unlock };
  }
}
