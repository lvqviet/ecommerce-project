import { Connection } from 'mongoose';
import { ProductSchema } from 'src/products/entities/product.entity';
import { VoucherSchema } from 'src/vouchers/entities/voucher.entity';
import { OrderSchema } from './entities/order.entity';

export const ordersProviders = [
  {
    provide: 'ORDER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Order', OrderSchema, 'orders'),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'PRODUCT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Product', ProductSchema, 'products'),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'VOUCHER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Voucher', VoucherSchema, 'voucher'),
    inject: ['DATABASE_CONNECTION'],
  },
];
