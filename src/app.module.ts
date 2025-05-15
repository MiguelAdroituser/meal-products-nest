import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { MealsWsModule } from './meals-ws/meals-ws.module';
import { EventsService } from './events/events.service';
import { EventsModule } from './events/events.module';


@Module({
  imports: [ 

    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),

    ProductsModule,

    AuthModule,

    CommonModule,

    MealsWsModule,

    EventsModule

   ],
  controllers: [],
  providers: [EventsService],
  exports:[],
})
export class AppModule {}
