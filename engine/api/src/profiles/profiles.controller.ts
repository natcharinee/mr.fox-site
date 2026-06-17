import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';
import {
  creatorProfiles,
  creatorSettings,
  follows,
  posts,
  users,
} from '../database/schema';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly database: DatabaseService) {}

  @Get('me')
  async me(@CurrentUser() user: JwtPayload) {
    const [profile] = await this.database.db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.userId, user.sub))
      .limit(1);
    const [settings] = await this.database.db
      .select()
      .from(creatorSettings)
      .where(eq(creatorSettings.userId, user.sub))
      .limit(1);
    return { profile, settings };
  }

  @Get(':username')
  async byUsername(@Param('username') username: string) {
    const [profile] = await this.database.db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.username, username))
      .limit(1);
    if (!profile) return null;

    const [settings] = await this.database.db
      .select()
      .from(creatorSettings)
      .where(eq(creatorSettings.userId, profile.userId))
      .limit(1);

    const [followerCount] = await this.database.db
      .select({ count: follows.id })
      .from(follows)
      .where(eq(follows.creatorId, profile.userId));

    const [postCount] = await this.database.db
      .select({ count: posts.id })
      .from(posts)
      .where(eq(posts.creatorId, profile.userId));

    return {
      profile,
      settings,
      stats: {
        followers: followerCount?.count ?? 0,
        posts: postCount?.count ?? 0,
      },
    };
  }

  @Put('me')
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: Partial<{
      displayName: string;
      bio: string;
      category: string;
      location: string;
      profileImageUrl: string;
      coverImageUrl: string;
      chatPrice: number;
      voicePrice: number;
      videoPrice: number;
      subPriceMonthly: number;
    }>,
  ) {
    const {
      chatPrice,
      voicePrice,
      videoPrice,
      subPriceMonthly,
      ...profileFields
    } = body;

    if (Object.keys(profileFields).length) {
      await this.database.db
        .update(creatorProfiles)
        .set(profileFields)
        .where(eq(creatorProfiles.userId, user.sub));
    }

    if (
      chatPrice !== undefined ||
      voicePrice !== undefined ||
      videoPrice !== undefined ||
      subPriceMonthly !== undefined
    ) {
      await this.database.db
        .update(creatorSettings)
        .set({
          ...(chatPrice !== undefined && { chatPrice }),
          ...(voicePrice !== undefined && { voicePrice }),
          ...(videoPrice !== undefined && { videoPrice }),
          ...(subPriceMonthly !== undefined && { subPriceMonthly }),
        })
        .where(eq(creatorSettings.userId, user.sub));
    }

    return this.me(user);
  }
}

@Controller('creators')
export class CreatorsController {
  constructor(private readonly database: DatabaseService) {}

  @Get()
  list() {
    return this.database.db.select().from(creatorProfiles).limit(50);
  }
}
