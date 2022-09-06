import { Connection } from 'mongoose';
import { CategorySchema } from './entities/category.entity';

export const categoryProviders = [
  {
    provide: 'CATEGORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Category', CategorySchema, 'categories'),
    inject: ['DATABASE_CONNECTION'],
  },
];
