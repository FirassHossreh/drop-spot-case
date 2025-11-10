import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = (req as any).cookies?.jwt;
    if (!token) throw new UnauthorizedException('Token bulunamadı');

    try {
      const payload = this.jwtService.verify(token);

      (req as any).user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token geçersiz');
    }
  }
}
