import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORY_MODEL')
    private readonly categoryModel: Model<Category>,
    @Inject('PRODUCT_MODEL')
    private readonly productModel: Model<Product>,
  ) {}

  async create(data: CreateCategoryDto) {
    const category = new this.categoryModel(data);
    return category.save();
  }

  async findAll() {
    return this.categoryModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    return this.categoryModel.findById(id).exec();
  }

  async update(id: string, update: UpdateCategoryDto) {
    return this.categoryModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
  }

  async remove(id: string) {
    const anyProduct = await this.productModel.findOne({ category: id });

    if (anyProduct) {
      throw new BadRequestException('Category included in some products');
    }

    return this.categoryModel.findByIdAndRemove(id).exec();
  }
}
