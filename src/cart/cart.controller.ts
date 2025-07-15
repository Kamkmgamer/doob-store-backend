// src/cart/cart.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addItemToCart(
    @Req() req: AuthenticatedRequest,
    @Body() addItemToCartDto: AddItemToCartDto,
  ) {
    const userId = req.user.id;
    const { productId, quantity } = addItemToCartDto;
    return this.cartService.addItem(userId, productId, quantity);
  }

  @Patch(':productId')
  @HttpCode(HttpStatus.OK)
  async updateCartItemQuantity(
    @Req() req: AuthenticatedRequest,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const userId = req.user.id;
    const { quantity } = updateCartItemDto;
    return this.cartService.updateItemQuantity(userId, productId, quantity);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCartContents(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.cartService.getCartContents(userId);
  }

  // >>> THIS METHOD SHOULD COME BEFORE removeCartItem <<<
  @Delete('all') // The literal path should come before the parameterized path
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    await this.cartService.clearCart(userId);
  }

  // >>> THIS METHOD SHOULD COME AFTER clearCart <<<
  @Delete(':productId') // The parameterized path
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const userId = req.user.id;
    await this.cartService.removeItem(userId, productId);
  }
}