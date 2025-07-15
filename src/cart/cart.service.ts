// src/cart/cart.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException // Added for stock issues
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/product.entity'; // Import Product entity

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) // Inject Product repository to check stock
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Adds a product to the user's cart or updates its quantity if already present.
   */
  async addItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be at least 1.');
    }

    // 1. Find the product
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found.`);
    }

    // 2. Find if the item already exists in the user's cart
    let cartItem = await this.cartItemRepository.findOne({
      where: { userId, productId },
    });

    if (cartItem) {
      // Item already in cart, update quantity
      const newQuantity = cartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new ConflictException( // Use ConflictException for stock issues when adding more
          `Adding ${quantity} more of "${product.name}" would exceed available stock. Available: ${product.stock}, In cart: ${cartItem.quantity}. You can add up to ${product.stock - cartItem.quantity} more.`,
        );
      }
      cartItem.quantity = newQuantity;
    } else {
      // New item for the cart
      if (product.stock < quantity) {
        throw new ConflictException( // Use ConflictException for initial stock check
          `Not enough stock for "${product.name}". Available: ${product.stock}. Requested: ${quantity}.`,
        );
      }
      cartItem = this.cartItemRepository.create({
        userId,
        productId,
        quantity,
      });
    }

    return this.cartItemRepository.save(cartItem);
  }

  /**
   * Updates the quantity of an existing item in the user's cart.
   * If newQuantity is 0, the item is removed.
   */
  async updateItemQuantity(
    userId: string,
    productId: string,
    newQuantity: number,
  ): Promise<CartItem | void> { // Return void if item is removed
    if (newQuantity < 0) {
      throw new BadRequestException('Quantity cannot be negative.');
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: { userId, productId },
      relations: ['product'], // Eagerly load product to check stock
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Product with ID "${productId}" not found in your cart.`,
      );
    }

    if (newQuantity === 0) {
      // Remove item if quantity is set to 0
      await this.cartItemRepository.remove(cartItem);
      return; // Item removed
    }

    // Check stock for the new quantity
    if (cartItem.product.stock < newQuantity) {
      throw new ConflictException( // Use ConflictException for stock issues
        `Cannot update quantity for "${cartItem.product.name}". Available stock: ${cartItem.product.stock}. Requested quantity: ${newQuantity}.`,
      );
    }

    cartItem.quantity = newQuantity;
    return this.cartItemRepository.save(cartItem);
  }

  /**
   * Removes a specific product from the user's cart.
   */
  async removeItem(userId: string, productId: string): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Product with ID "${productId}" not found in your cart.`,
      );
    }

    await this.cartItemRepository.remove(cartItem);
  }

  /**
   * Retrieves all items currently in the user's cart.
   */
  async getCartContents(userId: string): Promise<CartItem[]> {
    // Eagerly load product details for each cart item
    return this.cartItemRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }

  /**
   * Clears all items from the user's cart.
   */
  async clearCart(userId: string): Promise<void> {
    const userCartItems = await this.cartItemRepository.find({
      where: { userId },
    });
    if (userCartItems.length > 0) {
      // Use remove method for bulk removal
      await this.cartItemRepository.remove(userCartItems);
    }
  }
}