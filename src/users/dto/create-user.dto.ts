// src/users/dto/create-user.dto.ts (THIS IS THE FILE I NEED TO SEE THE CONTENT OF)
import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto { // <--- THIS 'export' IS CRUCIAL
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}