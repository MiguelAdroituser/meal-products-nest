import { Module } from '@nestjs/common';
import { MealsWsService } from './meals-ws.service';
import { MealsWsGateway } from './meals-ws.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]) // Add this to access Product repository
  ],
  providers: [
    MealsWsGateway, 
    MealsWsService
  ],
  exports: [MealsWsService] // Export if needed by other modules
})
export class MealsWsModule {}
