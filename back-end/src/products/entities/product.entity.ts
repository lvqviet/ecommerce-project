import { Document, Schema } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Category } from './category.entity';

export const RatingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  rate: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export const ProductSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  pictures: [String],
  quantity: Number,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  ratings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Rating',
    },
  ],
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export interface Rating extends Document {
  user: string | User;
  rate: number;
  comment: string;
  createdAt: Date;
}

export interface Product extends Document {
  name: string;
  price: number;
  description: string;
  pictures: string[];
  quantity: number;

  ratings?: string[] | Rating[];
  category?: Category;
  createdAt: Date;
}
