import { Module } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { DatabaseModule } from 'src/database/database.module';
import { voucherProviders } from './vouchers.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [VouchersController],
  providers: [VouchersService, ...voucherProviders],
})
export class VouchersModule {}
