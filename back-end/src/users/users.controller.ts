import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { User } from 'src/auth/decorators/user-decorator';
import { UpdateCartDto } from './dto/update-cart.dto';

import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserAdminDto, UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  getAll(@User('isAdmin') isAdmin: boolean) {
    if (!isAdmin) {
      throw new ForbiddenException();
    }

    return this.usersService.getAll();
  }

  @Get(':id')
  getById(@Param('id') userId: string, @User('isAdmin') isAdmin: boolean) {
    if (!isAdmin) {
      throw new ForbiddenException();
    }

    return this.usersService.getById(userId);
  }

  @Put(':id')
  updateById(
    @Param('id') userId: string,
    @Body() dto: UpdateUserAdminDto,
    @User('isAdmin') isAdmin: boolean,
  ) {
    if (!isAdmin) {
      throw new ForbiddenException();
    }

    return this.usersService.updateById(userId, dto);
  }

  @Delete(':id')
  deleteById(@Param('id') userId: string, @User('isAdmin') isAdmin: boolean) {
    if (!isAdmin) {
      throw new ForbiddenException();
    }

    return this.usersService.deleteById(userId);
  }

  @ApiOperation({ summary: 'Get profile' })
  @Get('/me/profile')
  getProfile(@User('id') userId: string) {
    return this.usersService.getById(userId);
  }

  @ApiOperation({ summary: 'Update profile' })
  @Put('/me/profile')
  updateProfile(@User('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @ApiOperation({ summary: 'Update password' })
  @Put('/me/password')
  changePassword(@User('id') userId: string, @Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(userId, dto);
  }

  @ApiOperation({ summary: 'Get cart' })
  @Get('me/cart')
  getCart(@User('id') userId: string) {
    return this.usersService.getCart(userId);
  }

  @ApiOperation({ summary: 'Update cart' })
  @ApiBody({ type: UpdateCartDto })
  @Put('me/cart')
  updateCart(@User('id') userId: string, @Body() dto: UpdateCartDto) {
    return this.usersService.updateCart(userId, dto);
  }
}
