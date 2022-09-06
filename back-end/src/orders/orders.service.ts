import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import * as moment from 'moment';

import { Product } from 'src/products/entities/product.entity';
import { Cart } from 'src/users/entities/cart.entity';
import { Voucher } from 'src/vouchers/entities/voucher.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_MODEL')
    private readonly orderModel: Model<Order>,
    @Inject('PRODUCT_MODEL')
    private readonly productModel: Model<Product>,
    @Inject('VOUCHER_MODEL')
    private readonly voucherModel: Model<Voucher>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async create(
    userId: string,
    { address, phoneNumber, cartItems, voucherId }: CreateOrderDto,
  ) {
    // Validate cart products
    const cart = await this.cache.get<Cart>(`cart:${userId}`);

    if (!cart) {
      throw new BadRequestException('Cart empty');
    }

    if (cartItems.some((idx) => idx < 0 || idx > cart.items.length - 1)) {
      throw new BadRequestException('Invalid cart item index');
    }

    const checkoutItems = cart.items
      .filter((_, idx) => cartItems.includes(idx))
      .map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      }));
    const products = await this.productModel.find({
      _id: { $in: checkoutItems.map((item) => item.product) },
    });

    for (let i = 0; i < checkoutItems.length; ++i) {
      const product = products.find(
        (p) => p._id.toString() === checkoutItems[i].product,
      );
      console.log(product.quantity, checkoutItems[i].quantity);
      if (product.quantity < checkoutItems[i].quantity) {
        throw new BadRequestException(`Product ${products[i].name} sold out`);
      }
    }

    // Init order
    const order = new this.orderModel({
      userId,
      address,
      phoneNumber,
      totalPayment: checkoutItems.reduce(
        (total, item) =>
          total +
          item.quantity *
            products.find((p) => p._id.toString() === item.product).price,
        0,
      ),
      discount: 0,
      deliveryFee: 23000,
      items: checkoutItems,
      status: OrderStatus.CREATED,
      createdAt: new Date(),
    });

    // Save
    if (voucherId) {
      const voucher = await this.voucherModel.findById(voucherId);

      if (!voucher) {
        throw new BadRequestException('Voucher not found');
      }
      if (moment(voucher.expiredAt).endOf('day').isBefore(Date.now())) {
        throw new BadRequestException('Voucher expired');
      }
      if (voucher.quantity === 0) {
        throw new BadRequestException('Voucher fully redeemed');
      }

      order.discount = voucher.value;
      voucher.quantity = voucher.quantity - 1;

      await voucher.save();
    }

    products.forEach((product) => {
      product.quantity =
        product.quantity -
        checkoutItems.find((item) => item.product === product.id).quantity;
    });

    await this.productModel.bulkSave(products);
    await this.cache.set(
      `cart:${userId}`,
      { items: cart.items.filter((_, idx) => !cartItems.includes(idx)) },
      { ttl: 24 * 3600 },
    );

    return order.save();
  }

  async statistic(from?: Date, to?: Date) {
    let orders;

    if (!from) {
      if (!to) {
        orders = await this.orderModel.find().sort({ createdAt: -1 });
      } else {
        orders = await this.orderModel
          .find({ createdAt: { $lt: to } })
          .sort({ createdAt: -1 });
      }
    } else {
      if (!to) {
        orders = await this.orderModel
          .find({ createdAt: { $gt: from } })
          .sort({ createdAt: -1 });
      } else {
        orders = await this.orderModel
          .find({ createdAt: { $gt: from, $lt: to } })
          .sort({ createdAt: -1 });
      }
    }

    let totalCreatedOrders = 0,
      totalShippingOrders = 0,
      totalDeliveredOrders = 0,
      totalCancelledOrders = 0,
      totalPayment = 0,
      totalDeliveryFee = 0,
      totalDiscount = 0;

    for (let i = 0; i < orders.length; ++i) {
      switch (orders[i].status) {
        case OrderStatus.CREATED:
          totalCreatedOrders++;
          break;
        case OrderStatus.SHIPPING:
          totalShippingOrders++;
          break;
        case OrderStatus.DELIVERED:
          totalDeliveredOrders++;
          break;
        case OrderStatus.CANCELLED:
          totalCancelledOrders++;
          break;
        default:
          break;
      }

      if (orders[i].status === OrderStatus.DELIVERED) {
        totalPayment += orders[i].totalPayment || 0;
        totalDiscount += orders[i].discount || 0;
        totalDeliveryFee += orders[i].deliveryFee || 0;
      }
    }

    return {
      totalCreatedOrders,
      totalShippingOrders,
      totalDeliveredOrders,
      totalCancelledOrders,
      totalPayment,
      totalDeliveryFee,
      totalDiscount,
      orders,
    };
  }

  findAll() {
    return this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .populate('items.product');
  }

  findAllForUser(userId: string) {
    return this.orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'items.product',
        populate: {
          path: 'ratings',
          model: 'Rating',
        },
      });
  }

  async findOneByAdmin(id: string) {
    return this.orderModel
      .findOne({ _id: id })
      .populate('items.product')
      .populate('userId');
  }

  async findOne(userId: string, id: string) {
    return this.orderModel
      .findOne({ _id: id, userId })
      .populate('items.product');
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderModel
      .findOne({ _id: id })
      .populate('items.product');

    switch (status) {
      case OrderStatus.SHIPPING:
        order.status = status;
        order.shippingAt = new Date();
        break;
      case OrderStatus.DELIVERED:
        order.status = status;
        order.deliveredAt = new Date();
        break;
      case OrderStatus.CANCELLED:
        order.status = status;
        order.cancelledAt = new Date();
        break;
      default:
        break;
    }

    if (status === OrderStatus.CANCELLED) {
      const products = order.items.map((item) => item.product);

      products.forEach((product, idx) => {
        product.quantity += order.items[idx].quantity;
      });
      await this.productModel.bulkSave(products);
    }

    return order.save();
  }

  async cancel(userId: string, id: string) {
    const order = await this.orderModel
      .findOne({ _id: id, userId })
      .populate('items.product');

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.status !== OrderStatus.CREATED) {
      throw new BadRequestException(`Cannot cancel ${order.status} order`);
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();

    const products = order.items.map((item) => item.product);

    products.forEach((product) => {
      product.quantity += order.items.find(
        (item) => item.product.id === product.id,
      ).quantity;
    });
    await this.productModel.bulkSave(products);

    return order.save();
  }
}
