import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../common/decorators';
import { RedisService } from '../redis/redis.service';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly redis: RedisService) {}

  @Get(':period')
  @Public()
  async leaderboard(@Param('period') period: string) {
    const key = `ranking:${period}`;
    const rows = await this.redis.redis.zrevrange(key, 0, 19, 'WITHSCORES');
    const result = [];
    for (let i = 0; i < rows.length; i += 2) {
      result.push({ creatorId: rows[i], score: Number(rows[i + 1]) });
    }
    return result;
  }
}
