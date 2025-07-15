// src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// --- NEW IMPORTS FOR RBAC ---
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { Public } from '../auth/public.decorator'; // <-- IMPORT THE PUBLIC DECORATOR
// --- END NEW IMPORTS ---

@Controller('products')
// IMPORTANT: If you have @UseGuards(JwtAuthGuard) at the controller level here,
// then every method will require JWT by default. In that case, you MUST use @Public()
// on individual methods you want to be public.
// If you don't have it here, then you're applying guards per method, which is also fine.
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Only ADMINs can create products
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // Anyone (public) can view all products
  @Public() // <-- ADD THIS DECORATOR HERE
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Anyone (public) can view a single product
  @Public() // <-- ADD THIS DECORATOR HERE
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  // Only ADMINs can update products
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  // Only ADMINs can delete products
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}