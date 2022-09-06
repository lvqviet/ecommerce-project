import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public-decorator';
import { User } from 'src/auth/decorators/user-decorator';

import { CategoriesService } from './categories.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Product')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create category' })
  @ApiBody({ type: CreateCategoryDto })
  @Post()
  create(
    @User('isAdmin') isAdmin: boolean,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    if (!isAdmin) {
      throw new ForbiddenException();
    }

    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all category' })
  @Public()
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiBody({ type: UpdateCategoryDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @User('isAdmin') isAdmin: boolean,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    if (!isAdmin) {
      throw new ForbiddenException();
    }

    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete category' })
  @Delete(':id')
  remove(@Param('id') id: string, @User('isAdmin') isAdmin: boolean) {
    if (!isAdmin) {
      throw new ForbiddenException();
    }

    return this.categoriesService.remove(id);
  }
}
