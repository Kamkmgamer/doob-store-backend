// src/auth/dto/login.dto.ts
import { IsString, MinLength } from 'class-validator';

export class LoginDto { // <--- 'export class' is crucial
  @IsString()
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}