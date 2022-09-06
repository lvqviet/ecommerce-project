import { Connection } from 'mongoose';
import { OrderSchema } from 'src/orders/entities/order.entity';
import { ProductSchema } from 'src/products/entities/product.entity';
import { UserSchema } from './entities/user.entity';

export const usersProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
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
