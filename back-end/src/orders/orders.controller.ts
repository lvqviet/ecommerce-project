import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  ParseEnumPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/decorators/user-decorator';
import { OrderStatus } from './entities/order.entity';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create order' })
  @Post()
  create(@User('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(userId, dto);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @Get()
  findAll(@User() user: { id: string; isAdmin: boolean }) {
    return user.isAdmin
      ? this.ordersService.findAll()
      : this.ordersService.findAllForUser(user.id);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiQuery({ name: 'from', type: Date, required: false })
  @ApiQuery({ name: 'to', type: Date, required: false })
  @Get('statistic')
  getStatistic(
    @Query('from', new DefaultValuePipe(null)) from: Date | null,
    @Query('to', new DefaultValuePipe(null)) to: Date | null,
  ) {
    return this.ordersService.statistic(from, to);
  }

  @ApiOperation({ summary: 'Get details order' })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @User() user: { id: string; isAdmin: boolean },
  ) {
    return user.isAdmin
      ? this.ordersService.findOneByAdmin(id)
      : this.ordersService.findOne(user.id, id);
  }

  @ApiOperation({ summary: 'Update order status' })
  @ApiQuery({ name: 'status' })
  @Put(':id')
  updateStatus(
    @Param('id') id: string,
    @Query('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  @ApiOperation({ summary: 'Cancel order' })
  @Put(':id/cancel')
  cancel(@Param('id') id: string, @User('id') userId: string) {
    return this.ordersService.cancel(userId, id);
  }
}
