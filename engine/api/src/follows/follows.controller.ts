import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';
import { follows } from '../database/schema';

@Controller('follows')
export class FollowsController {
  constructor(private readonly database: DatabaseService) {}

  @Post(':creatorId')
  follow(
    @CurrentUser() user: JwtPayload,
    @Param('creatorId') creatorId: string,
  ) {
    return this.database.db
      .insert(follows)
      .values({ followerId: user.sub, creatorId: Number(creatorId) })
      .onConflictDoNothing();
  }

  @Delete(':creatorId')
  unfollow(
    @CurrentUser() user: JwtPayload,
    @Param('creatorId') creatorId: string,
  ) {
    return this.database.db
      .delete(follows)
      .where(eq(follows.followerId, user.sub));
  }

  @Get('following')
  following(@CurrentUser() user: JwtPayload) {
    return this.database.db
      .select()
      .from(follows)
      .where(eq(follows.followerId, user.sub));
  }

  @Get('check')
  check(
    @CurrentUser() user: JwtPayload,
    @Body() body: { creatorId: number },
  ) {
    return this.database.db
      .select()
      .from(follows)
      .where(eq(follows.followerId, user.sub));
  }
}
