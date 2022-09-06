import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './entities/voucher.entity';

@Injectable()
export class VouchersService {
  constructor(
    @Inject('VOUCHER_MODEL')
    private readonly voucherModel: Model<Voucher>,
  ) {}

  async create(dto: CreateVoucherDto) {
    const voucher = new this.voucherModel(dto);

    return voucher.save();
  }

  async findAll() {
    return this.voucherModel.find().sort({ createdAt: -1 });
  }

  findOne(id: string) {
    return this.voucherModel.findById(id);
  }

  async update(id: string, update: UpdateVoucherDto) {
    return this.voucherModel.findByIdAndUpdate(id, update, { new: true });
  }

  async remove(id: string) {
    return this.voucherModel.findByIdAndDelete(id);
  }
}
