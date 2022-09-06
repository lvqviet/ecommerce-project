import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';

import { User } from './entities/user.entity';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cache } from 'cache-manager';
import { Product } from 'src/products/entities/product.entity';
import { Cart } from './entities/cart.entity';
import { Order } from 'src/orders/entities/order.entity';
import { UpdateUserAdminDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private readonly userModel: Model<User>,
    @Inject('PRODUCT_MODEL')
    private readonly productModel: Model<Product>,
    @Inject('ORDER_MODEL')
    private readonly orderModel: Model<Order>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async createUser(user: Partial<User>) {
    const created = new this.userModel(user);
    created.createdAt = new Date();

    return created.save();
  }

  async getAll() {
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  async getByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async getById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async updateById(id: string, update: UpdateUserAdminDto) {
    if (Object.keys(update).includes('email')) {
      const existingUser = await this.getByEmail(update.email);
      if (existingUser) {
        throw new BadRequestException('Email already exist');
      }
    }

    return this.userModel.findByIdAndUpdate(id, update).exec();
  }

  async updateProfile(id: string, update: any) {
    return this.userModel.findByIdAndUpdate(id, update).exec();
  }

  async updatePassword(id: string, { currentPassword, newPassword }) {
    const existing = await this.userModel.findById(id).exec();

    if (!(await compare(currentPassword, existing.password))) {
      throw new BadRequestException('Invalid password');
    }

    existing.password = await hash(newPassword, 10);

    return existing.save();
  }

  async deleteById(id: string) {
    const anyOrders = await this.orderModel.findOne({ userId: id });

    if (anyOrders) {
      throw new BadRequestException(`User have ordered`);
    }

    return this.userModel.findByIdAndRemove(id);
  }

  async getCart(id: string) {
    const cart = await this.cache.get<Cart>(`cart:${id}`);

    if (!cart) return [];

    const products = await this.productModel.find({
      _id: { $in: cart.items.map((item) => item.productId) },
    });

    return cart.items.map((item) => ({
      product: products.find((p) => p._id.toString() === item.productId),
      quantity: item.quantity,
    }));
  }

  async updateCart(id: string, dto: UpdateCartDto) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.cache.set(`cart:${id}`, dto, { ttl: 24 * 3600 });
  }
}
