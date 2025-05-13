import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MealsWsModule } from 'src/meals-ws/meals-ws.module';

@Module({
  controllers: [ ProductsController ],
  providers: [ ProductsService ],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ Product ]),
    MealsWsModule // Add this to enable WebSocket integration
  ]
})
export class ProductsModule {}
