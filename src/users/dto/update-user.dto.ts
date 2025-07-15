// src/users/dto/update-user.dto.ts (Full updated file)
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto'; // This import needs to be fixed first
import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Explicitly include username and email as optional for update,
  // even if they come from PartialType, for clearer type inference
  @IsOptional()
  @IsString()
  username?: string; // <-- ADD THIS

  @IsOptional()
  @IsEmail()
  email?: string; // <-- ADD THIS

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string; // <-- If you allow password update via this DTO

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  streetAddress?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  stateProvince?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  country?: string;
}