import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { CallsModule } from './calls/calls.module';
import { ChatsModule } from './chats/chats.module';
import { DatabaseModule } from './database/database.module';
import { FanClubsModule } from './fan-clubs/fan-clubs.module';
import { FollowsModule } from './follows/follows.module';
import { GiftsModule } from './gifts/gifts.module';
import { HealthController } from './health.controller';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { LiveModule } from './live/live.module';
import { ModerationModule } from './moderation/moderation.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';
import { ProfilesModule } from './profiles/profiles.module';
import { RankingsModule } from './rankings/rankings.module';
import { RedisModule } from './redis/redis.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UnlocksModule } from './unlocks/unlocks.module';
import { VotesModule } from './votes/votes.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    ProfilesModule,
    PostsModule,
    FollowsModule,
    WalletModule,
    VotesModule,
    GiftsModule,
    SubscriptionsModule,
    UnlocksModule,
    ChatsModule,
    LiveModule,
    CallsModule,
    RankingsModule,
    FanClubsModule,
    ModerationModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
