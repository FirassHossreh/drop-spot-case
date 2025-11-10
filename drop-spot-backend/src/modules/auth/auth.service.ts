import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(body: RegisterDto) {
    const exist = await this.usersRepository.findOne({
      where: { email: body.email },
    });
    if (exist) throw new BadRequestException('Email already in use');

    const hashed = await bcrypt.hash(body.password, 10);

    const user = this.usersRepository.create({
      ...body,
      password: hashed,
      roles: 'user',
    });

    const saved = await this.usersRepository.save(user);
    const { password, ...userWithoutPassword } = saved;

    const payload = { id: saved.id, email: saved.email, roles: saved.roles };
    const token = this.jwtService.sign(payload);

    return { user: userWithoutPassword, token };
  }

  async login(body: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: body.email },
    });

    if (!user) throw new UnauthorizedException('Invalid Email Or Password');

    const isMatched = await bcrypt.compare(body.password, user.password);
    if (!isMatched)
      throw new UnauthorizedException('Invalid Email Or Password');

    const { password, ...userWithoutPassword } = user;

    const payload = { id: user.id, email: user.email, roles: user.roles };
    const token = this.jwtService.sign(payload);

    return { user: userWithoutPassword, token };
  }
}
