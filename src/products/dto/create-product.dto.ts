import { IsString, IsNumber, IsUrl, IsArray, IsInt, Min, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsUrl()
  imageUrl: string;

  @IsString()
  category: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  ratingRate: number;

  @IsInt()
  @Min(0)
  ratingCount: number;

  @IsArray()
  @IsString({ each: true }) // Each item in the array must be a string
  details: string[];

  @IsInt()
  @Min(0)
  stock: number;
}