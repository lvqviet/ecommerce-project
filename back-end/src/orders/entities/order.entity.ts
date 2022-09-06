import { Document, Schema } from 'mongoose';
import { Product } from 'src/products/entities/product.entity';

export enum OrderStatus {
  CREATED = 'created',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  address: String,
  phoneNumber: String,
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
    },
  ],
  totalPayment: Number,
  deliveryFee: Number,
  discount: Number,
  status: String,

  createdAt: Date,
  shippingAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
});

export interface Order extends Document {
  userId: string;
  address: string;
  phoneNumber: string;
  items: [
    {
      product: Product;
      quantity: number;
    },
  ];
  totalPayment: number;
  deliveryFee: number;
  discount: number;
  status: OrderStatus;
  createdAt: Date;
  shippingAt: Date;
  deliveredAt: Date;
  cancelledAt: Date;
}
