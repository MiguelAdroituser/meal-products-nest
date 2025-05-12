import { Module } from '@nestjs/common';
import { MealsWsService } from './meals-ws.service';
import { MealsWsGateway } from './meals-ws.gateway';

@Module({
  providers: [MealsWsGateway, MealsWsService],
})
export class MealsWsModule {}
