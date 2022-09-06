import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rate: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment?: string;
}
