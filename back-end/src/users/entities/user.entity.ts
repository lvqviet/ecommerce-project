import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    index: true,
  },
  phoneNumber: {
    type: String,
    require: false,
  },
  password: String,
  address: String,
  avatar: String,
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  address?: string;
  avatar?: string;
  active?: boolean;
  createdAt: Date;
}
