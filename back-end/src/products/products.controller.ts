import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/decorators/user-decorator';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Public } from 'src/auth/decorators/public-decorator';

@ApiTags('Product')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create product' })
  @ApiBody({ type: CreateProductDto })
  @Post()
  create(@User('isAdmin') isAdmin: boolean, @Body() dto: CreateProductDto) {
    if (!isAdmin) {
      throw new ForbiddenException();
    }
    return this.productsService.create(dto);
  }

  @ApiOperation({ summary: 'Get all product' })
  @Public()
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Get product by ID' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiBody({ type: UpdateProductDto })
  @Put(':id')
  update(
    @Param('id') id: string,
    @User('isAdmin') isAdmin: boolean,
    @Body() dto: UpdateProductDto,
  ) {
    if (!isAdmin) {
      throw new ForbiddenException();
    }
    return this.productsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete product' })
  @Delete(':id')
  remove(@Param('id') id: string, @User('isAdmin') isAdmin: boolean) {
    if (!isAdmin) {
      throw new ForbiddenException();
    }
    return this.productsService.remove(id);
  }

  @ApiOperation({ summary: 'Rate product' })
  @ApiBody({ type: CreateRatingDto })
  @Post(':productId/ratings')
  createRating(
    @Param('productId') productId: string,
    @User('id') userId: string,
    @Body() dto: CreateRatingDto,
  ) {
    return this.productsService.createRating(productId, userId, dto);
  }

  @ApiOperation({ summary: 'Rate product' })
  @ApiBody({ type: UpdateRatingDto })
  @Put(':productId/ratings/:ratingId')
  updateRating(
    @Param('productId') productId: string,
    @Param('ratingId') ratingId: string,
    @User('id') userId: string,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.productsService.updateRating(productId, ratingId, userId, dto);
  }

  @ApiOperation({ summary: 'Rate product' })
  @Delete(':productId/ratings/:ratingId')
  removeRating(
    @Param('productId') productId: string,
    @Param('ratingId') ratingId: string,
    @User('id') userId: string,
  ) {
    return this.productsService.removeRating(productId, ratingId, userId);
  }
}
