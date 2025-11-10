import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];
    if (!requiredRoles.length) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return false;

    console.log('firass user', user);
    const userRoles = user.roles;

    const hasRole = requiredRoles.includes(userRoles);

    if (!hasRole) throw new ForbiddenException('Yeterli yetkiniz yok');

    return true;
  }
}
