import { Body, Controller, Get, Post } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';
import { fanClubs } from '../database/schema';

@Controller('fan-clubs')
export class FanClubsController {
  constructor(private readonly database: DatabaseService) {}

  @Post('join')
  join(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      creatorId: number;
      tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    },
  ) {
    return this.database.db
      .insert(fanClubs)
      .values({
        visitorId: user.sub,
        creatorId: body.creatorId,
        tier: body.tier,
      })
      .onConflictDoNothing()
      .returning();
  }

  @Get('my')
  my(@CurrentUser() user: JwtPayload) {
    return this.database.db
      .select()
      .from(fanClubs)
      .where(eq(fanClubs.visitorId, user.sub));
  }
}
