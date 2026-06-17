import { Body, Controller, Get, Post } from '@nestjs/common';
import { desc } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { Roles } from '../common/decorators';
import { DatabaseService } from '../database/database.service';
import { moderationLogs, reports } from '../database/schema';

@Controller('moderation')
export class ModerationController {
  constructor(private readonly database: DatabaseService) {}

  @Post('reports')
  report(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: { targetType: string; targetId: number; reason: string },
  ) {
    return this.database.db
      .insert(reports)
      .values({
        reporterId: user.sub,
        targetType: body.targetType,
        targetId: body.targetId,
        reason: body.reason,
      })
      .returning();
  }

  @Get('reports')
  @Roles('admin')
  listReports() {
    return this.database.db
      .select()
      .from(reports)
      .orderBy(desc(reports.createdAt))
      .limit(50);
  }

  @Post('action')
  @Roles('admin')
  action(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      action: string;
      targetType: string;
      targetId: number;
      details?: string;
    },
  ) {
    return this.database.db
      .insert(moderationLogs)
      .values({
        adminId: user.sub,
        action: body.action,
        targetType: body.targetType,
        targetId: body.targetId,
        details: body.details,
      })
      .returning();
  }
}
