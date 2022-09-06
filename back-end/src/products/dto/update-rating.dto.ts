import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateRatingDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rate?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment?: string;
}
