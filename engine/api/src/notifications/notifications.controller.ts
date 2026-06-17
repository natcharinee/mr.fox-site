import { Controller, Get, Param, Put } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';
import { notifications } from '../database/schema';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly database: DatabaseService) {}

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.database.db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.sub))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
  }

  @Put(':id/read')
  markRead(@Param('id') id: string) {
    return this.database.db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(eq(notifications.id, Number(id)));
  }
}
