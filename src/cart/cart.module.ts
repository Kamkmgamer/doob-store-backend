// src/cart/cart.module.ts
import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller'; // Keep only this one
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem, Product]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}