import { Schema } from 'mongoose';

export const CategorySchema = new Schema({
  name: String,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export interface Category extends Document {
  name: string;
}
