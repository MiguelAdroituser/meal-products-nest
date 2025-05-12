import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ ProductsController ],
  providers: [ ProductsService ],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ Product ])
  ]
})
export class ProductsModule {}
