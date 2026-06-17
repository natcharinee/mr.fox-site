import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';
import { posts, votes } from '../database/schema';
import { WalletService } from '../wallet/wallet.service';

const VOTE_TIERS = [10, 20, 50, 100];

@Controller('votes')
export class VotesController {
  constructor(
    private readonly database: DatabaseService,
    private readonly wallet: WalletService,
  ) {}

  @Get('tiers')
  tiers() {
    return VOTE_TIERS;
  }

  @Post('posts/:postId')
  async voteOnPost(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: string,
    @Body() body: { amount: number },
  ) {
    if (!VOTE_TIERS.includes(body.amount)) {
      throw new Error('Invalid vote tier');
    }

    const [post] = await this.database.db
      .select()
      .from(posts)
      .where(eq(posts.id, Number(postId)))
      .limit(1);
    if (!post) throw new Error('Post not found');

    await this.wallet.splitPayment(
      'vote',
      post.creatorId,
      user.sub,
      body.amount,
      `vote:post:${postId}`,
    );

    const [vote] = await this.database.db
      .insert(votes)
      .values({
        visitorId: user.sub,
        postId: Number(postId),
        amount: body.amount,
      })
      .returning();

    return vote;
  }

  @Get('ranking/:period')
  ranking(@Param('period') period: string) {
    return this.database.db
      .select()
      .from(votes)
      .orderBy(desc(votes.amount))
      .limit(20);
  }
}
