import { Connection } from 'mongoose';
import { ProductSchema, RatingSchema } from './entities/product.entity';
import { CategorySchema } from './entities/category.entity';
import { OrderSchema } from 'src/orders/entities/order.entity';

export const productsProviders = [
  {
    provide: 'CATEGORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Category', CategorySchema, 'categories'),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'RATING_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Rating', RatingSchema, 'ratings'),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'PRODUCT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Product', ProductSchema, 'products'),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'ORDER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Order', OrderSchema, 'orders'),
    inject: ['DATABASE_CONNECTION'],
  },
];
