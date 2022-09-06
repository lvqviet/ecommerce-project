import { CacheModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { get } from 'env-var';

import { EventEmitterModule } from '@nestjs/event-emitter';
import * as redisStore from 'cache-manager-redis-store';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { JwtAuthGuard } from './auth/guards/jwt-guard';
import { VouchersModule } from './vouchers/vouchers.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: get('REDIS_URL')
        .default(process.env.REDIS_URL || 'redis://localhost:6379')
        .asString(),
    }),

    AuthModule,

    UsersModule,
    ProductsModule,
    OrdersModule,
    VouchersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
