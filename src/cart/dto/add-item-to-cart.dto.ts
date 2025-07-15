// src/cart/dto/add-item-to-cart.dto.ts
import { IsUUID, IsInt, Min } from 'class-validator';

export class AddItemToCartDto {
  @IsUUID('4', { message: 'productId must be a valid UUID' })
  productId: string; // The ID of the product to add

  @IsInt({ message: 'quantity must be an integer' })
  @Min(1, { message: 'quantity must be at least 1' })
  quantity: number; // The quantity of the product
}