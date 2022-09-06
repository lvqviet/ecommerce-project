import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model, ObjectId, Schema } from 'mongoose';
import { ObjectUnsubscribedError } from 'rxjs';
import { Order } from 'src/orders/entities/order.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Category } from './entities/category.entity';

import { Product, Rating } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_MODEL')
    private readonly productModel: Model<Product>,
    @Inject('RATING_MODEL')
    private readonly ratingModel: Model<Rating>,
    @Inject('CATEGORY_MODEL')
    private readonly categoryModel: Model<Category>,
    @Inject('ORDER_MODEL')
    private readonly orderModel: Model<Order>,
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.categoryModel.findById(dto.category);
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const product = new this.productModel(dto);

    return product.save();
  }

  async findAll() {
    return this.productModel
      .find()
      .sort({ createdAt: -1 })
      .populate('category')
      .exec();
  }

  async findOne(id: string) {
    return this.productModel
      .findById(id)
      .populate('category')
      .populate('ratings')
      .populate('ratings.user')
      .populate({
        path: 'ratings',
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .exec();
  }

  async update(id: string, update: UpdateProductDto) {
    return this.productModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
  }

  async remove(id: string) {
    const anyOrder = await this.orderModel.findOne({
      'items.product': id,
    });

    if (anyOrder) {
      throw new BadRequestException('Product included in some orders');
    }

    return this.productModel.findByIdAndRemove(id).exec();
  }

  async createRating(productId: string, userId: string, dto: CreateRatingDto) {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const rating = await this.ratingModel.create({ user: userId, ...dto });
    (product.ratings as string[]).push(rating._id.toString());

    return product.save();
  }

  async updateRating(_, ratingId, userId, update) {
    let rating = await this.ratingModel.findById(ratingId);
    if (!rating || rating.user.toString() !== userId) {
      throw new BadRequestException('Rating not found');
    }

    Object.assign(rating, update);

    return rating.save();
  }

  async removeRating(productId: string, ratingId: string, userId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const rating = await this.ratingModel.findById(ratingId);
    if (!rating || rating.user.toString() !== userId) {
      throw new BadRequestException('Rating not found');
    }

    product.ratings = (product.ratings as string[]).filter(
      (id) => id.toString() !== ratingId,
    );

    await this.ratingModel.remove(rating);

    return product.save();
  }
}
