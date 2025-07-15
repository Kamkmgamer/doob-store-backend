// src/cart/entities/cart-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity'; // Import the User entity
import { Product } from '../../products/product.entity'; // Import the Product entity

@Entity('cart_items') // Recommended: use snake_case for table names
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Many CartItems can belong to one User
  @ManyToOne(() => User, (user) => user.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // Explicitly define the foreign key column name
  user: User;

  @Column()
  userId: string; // The foreign key column itself

  // Many CartItems can contain one Product
  @ManyToOne(() => Product, (product) => product.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' }) // Explicitly define the foreign key column name
  product: Product;

  @Column()
  productId: string; // The foreign key column itself

  @Column('int', { default: 1 }) // Quantity of the product in the cart
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}