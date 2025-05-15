import { Module } from '@nestjs/common';
import { EventsService } from './events.service';

@Module({
  providers: [EventsService],
  exports: [EventsService] // Important: This makes the service available to other modules
})
export class EventsModule {}