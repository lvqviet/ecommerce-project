import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class CartItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: string;
}

export class UpdateCartDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested()
  @Type(() => CartItemDto)
  @IsNotEmpty()
  items: CartItemDto[];
}
