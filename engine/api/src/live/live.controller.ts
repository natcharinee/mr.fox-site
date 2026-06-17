import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { Public } from '../common/decorators';
import { DatabaseService } from '../database/database.service';
import { liveArchives, liveRooms } from '../database/schema';
import { WalletService } from '../wallet/wallet.service';

@Controller('live')
export class LiveController {
  constructor(
    private readonly database: DatabaseService,
    private readonly wallet: WalletService,
  ) {}

  @Post('rooms')
  createRoom(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      title: string;
      type: 'free' | 'paid' | 'password' | 'paid_password';
      price?: number;
      password?: string;
    },
  ) {
    const sfuRoomId = `room_${Date.now()}`;
    return this.database.db
      .insert(liveRooms)
      .values({
        creatorId: user.sub,
        title: body.title,
        type: body.type,
        price: body.price,
        password: body.password,
        sfuRoomId,
        status: 'scheduled',
      })
      .returning();
  }

  @Post('rooms/:id/join')
  async join(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: { password?: string },
  ) {
    const [room] = await this.database.db
      .select()
      .from(liveRooms)
      .where(eq(liveRooms.id, Number(id)))
      .limit(1);
    if (!room) throw new Error('Room not found');

    if (room.type.includes('paid') && room.price) {
      await this.wallet.splitPayment(
        'live',
        room.creatorId,
        user.sub,
        room.price,
        `live:join:${id}`,
      );
    }

    if (room.type.includes('password') && room.password !== body.password) {
      throw new Error('Invalid password');
    }

    return {
      sfuRoomId: room.sfuRoomId,
      token: `sfu-token-${room.sfuRoomId}-${user.sub}`,
      message: 'Connect via LiveKit/SFU client',
    };
  }

  @Post('rooms/:id/start')
  start(@Param('id') id: string) {
    return this.database.db
      .update(liveRooms)
      .set({ status: 'live', startedAt: new Date() })
      .where(eq(liveRooms.id, Number(id)));
  }

  @Post('rooms/:id/archive')
  archive(
    @Param('id') id: string,
    @Body() body: { videoUrl: string; price: number },
  ) {
    return this.database.db
      .insert(liveArchives)
      .values({
        roomId: Number(id),
        videoUrl: body.videoUrl,
        price: body.price,
      })
      .returning();
  }

  @Get('rooms')
  @Public()
  list() {
    return this.database.db.select().from(liveRooms).limit(20);
  }
}
