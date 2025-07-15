// src/products/product.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CartItem } from '../cart/entities/cart-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true }) // KEEP THIS CHANGE: description made nullable
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  imageUrl: string;

  @Column()
  category: string;

  @Column('decimal', { precision: 3, scale: 2, nullable: true }) // <-- CHANGE THIS: Add nullable: true
  ratingRate: number;

  @Column('int', { nullable: true }) // <-- CHANGE THIS: Add nullable: true
  ratingCount: number;

  @Column('text', { array: true, nullable: true }) // This was already nullable, good.
  details: string[];

  @Column('int')
  stock: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];
}