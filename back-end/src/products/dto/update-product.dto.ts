import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, IsUrl } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: String;

  @ApiProperty()
  @IsOptional()
  @IsUrl({ each: true })
  pictures: [String];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity: number;
}
