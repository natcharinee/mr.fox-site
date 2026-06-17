import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { CurrentUser } from '../common/current-user.decorator';
import type { JwtPayload } from '../common/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';
import { comments, postLikes, postMedia, posts } from '../database/schema';

@Controller('posts')
export class PostsController {
  constructor(private readonly database: DatabaseService) {}

  @Get('feed')
  feed() {
    return this.database.db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(50);
  }

  @Get(':id')
  async one(@Param('id', ParseIntPipe) id: number) {
    const [post] = await this.database.db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);
    const media = await this.database.db
      .select()
      .from(postMedia)
      .where(eq(postMedia.postId, id));
    return { post, media };
  }

  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      type: 'photo' | 'video' | 'text' | 'album';
      content?: string;
      isLocked?: boolean;
      price?: number;
      media?: { url: string; blurUrl?: string; mediaType: string }[];
    },
  ) {
    const [post] = await this.database.db
      .insert(posts)
      .values({
        creatorId: user.sub,
        type: body.type,
        content: body.content,
        isLocked: body.isLocked ?? false,
        price: body.price,
      })
      .returning();

    if (body.media?.length) {
      await this.database.db.insert(postMedia).values(
        body.media.map((m) => ({
          postId: post.id,
          url: m.url,
          blurUrl: m.blurUrl,
          mediaType: m.mediaType,
        })),
      );
    }

    return post;
  }

  @Put(':id/pin')
  pin(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.database.db
      .update(posts)
      .set({ isPinned: true })
      .where(eq(posts.id, id));
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.database.db.delete(posts).where(eq(posts.id, id));
  }

  @Post(':id/like')
  like(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.database.db
      .insert(postLikes)
      .values({ postId: id, userId: user.sub })
      .onConflictDoNothing();
  }

  @Post(':id/comments')
  comment(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { content: string },
  ) {
    return this.database.db
      .insert(comments)
      .values({ postId: id, userId: user.sub, content: body.content })
      .returning();
  }
}
