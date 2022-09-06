import { Connection } from 'mongoose';
import { VoucherSchema } from './entities/voucher.entity';

export const voucherProviders = [
  {
    provide: 'VOUCHER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Voucher', VoucherSchema, 'voucher'),
    inject: ['DATABASE_CONNECTION'],
  },
];
