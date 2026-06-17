import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators';

@Controller()
export class HealthController {
  @Public()
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'mrfox-engine-api',
      version: '1.0.0',
    };
  }
}
