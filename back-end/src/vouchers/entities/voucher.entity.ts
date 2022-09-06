import { Document, Schema } from 'mongoose';

export const VoucherSchema = new Schema({
  name: String,
  value: Number,
  quantity: Number,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  expiredAt: Date,
});

export interface Voucher extends Document {
  name: string;
  value: number;
  quantity: number;
  createdAt: Date;
  expiredAt: Date;
}
