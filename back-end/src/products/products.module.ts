import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from 'src/database/database.module';
import { productsProviders } from './products.providers';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController, CategoriesController],
  providers: [...productsProviders, ProductsService, CategoriesService],
})
export class ProductsModule {}
