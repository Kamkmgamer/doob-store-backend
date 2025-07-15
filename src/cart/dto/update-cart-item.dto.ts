// src/cart/dto/update-cart-item.dto.ts
import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt({ message: 'quantity must be an integer' })
  @Min(0, { message: 'quantity must be at least 0 (0 to remove item)' })
  quantity: number; 
}