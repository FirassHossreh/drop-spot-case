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
    const startTime = Date.now();

    const exist = await this.usersRepository.findOne({
      where: { email: body.email },
    });
    if (exist) throw new BadRequestException('Email already in use');

    const hashed = await bcrypt.hash(body.password, 10);

    const user = this.usersRepository.create({
      ...body,
      password: hashed,
      roles: 'user',
      signupLatencyMs: Date.now() - startTime,
      accountAgeDays: 0,
      rapidActions: 0,
    });

    const saved = await this.usersRepository.save(user);
    const { password, ...userWithoutPassword } = saved;

    const payload = {
      id: saved.id,
      email: saved.email,
      roles: saved.roles,
      data: userWithoutPassword,
    };
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

    const now = new Date();
    const createdAt = user.createdAt;
    const accountAgeMs = now.getTime() - createdAt.getTime();
    const accountAgeDays = Math.floor(accountAgeMs / (1000 * 60 * 60 * 24));

    await this.usersRepository.update(user.id, {
      accountAgeDays: accountAgeDays,
    });

    const updatedUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    if (!updatedUser) {
      throw new UnauthorizedException('User not found after update');
    }

    const { password, ...userWithoutPassword } = updatedUser;

    const payload = {
      id: updatedUser.id,
      email: updatedUser.email,
      roles: updatedUser.roles,
      data: userWithoutPassword,
    };
    const token = this.jwtService.sign(payload);

    return {
      user: userWithoutPassword,
      token,
    };
  }
}
