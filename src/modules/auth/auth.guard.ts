import {
  applyDecorators,
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { configService } from '../../Services/config.service';
import { Role } from '../user/user.interface';
import { getUserBy } from '../user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log('req.headers', req.headers);
    if (!req.headers.authorization) return true;
    req.user = await this.validateToken(req.headers.authorization);
    return true;
  }

  async validateToken(auth: string) {
    try {
      if (auth.split(' ')[0] !== 'Bearer')
        throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, configService.getCommonfiles());
      return decoded;
    } catch (err) {
      const message = 'Token error- ' + err.message;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard));
}

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.id;
  },
);

export const GetHOAadminId = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    console.log(req.user);
    let user = await getUserBy({ id: req.user.id });
    if (user.role == Role.HOAAdmin) return req.user.id;
  },
);

export const GetUserDetail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
