import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MealsWsModule } from 'src/meals-ws/meals-ws.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  controllers: [ ProductsController ],
  providers: [ ProductsService ],
  exports: [ProductsService], // Add this line to export the service
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ Product ]),
    EventsModule // Add this
  ]
})
export class ProductsModule {}
