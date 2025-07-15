// src/users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'; // <-- Add OneToMany
import { UserRole } from './enums/user-role.enum';
import { CartItem } from '../cart/entities/cart-item.entity'; // <-- Import CartItem entity

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;
  @Column({ nullable: true })
  middleName: string;
  @Column({ nullable: true })
  lastName: string;
  @Column({ nullable: true })
  phoneNumber: string;
  @Column({ nullable: true })
  streetAddress: string;
  @Column({ nullable: true })
  city: string;
  @Column({ nullable: true })
  stateProvince: string;
  @Column({ nullable: true })
  postalCode: string;
  @Column({ nullable: true })
  country: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // --- NEW: Add OneToMany relationship to CartItem ---
  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];
  // --- END NEW ---
}