import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('healthcheck')
  healthCheck() {
    return HttpStatus.OK;
  }
}
