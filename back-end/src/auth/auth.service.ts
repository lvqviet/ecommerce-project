import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signUp(dto: SignUpDto) {
    const existing = await this.usersService.getByEmail(dto.email);

    if (existing) {
      throw new BadRequestException('Email already exist');
    }

    dto.password = await hash(dto.password, 10);

    return this.usersService.createUser(dto);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.active) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    return {
      token: this.jwtService.sign({
        id: user._id.toString(),
        active: user.active,
        isAdmin: user.email === 'admin@gmail.com',
      }),
    };
  }
}
