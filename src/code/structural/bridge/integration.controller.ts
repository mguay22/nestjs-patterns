import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './integration.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  send(
    @Body()
    body: { type: string; channel: string; orderId: string; to: string },
  ) {
    return this.notificationService.send(body);
  }
}
