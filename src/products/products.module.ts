// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { Product } from './product.entity'; // Import your Product entity

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // Register Product entity with TypeORM
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // <-- ADD THIS LINE to export the service
})
export class ProductsModule {}