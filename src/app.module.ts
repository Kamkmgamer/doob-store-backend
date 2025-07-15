// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module'; // <-- This import must exist

import { Product } from './products/product.entity';
import { User } from './users/user.entity';
import { CartItem } from './cart/entities/cart-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [Product, User, CartItem],
        synchronize: true,
        logging: ['query', 'schema'],
      }),
    }),
    ProductsModule,
    UsersModule,
    AuthModule,
    CartModule, // <-- CartModule MUST be listed here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}