import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { JwtStrategy } from './jwt.strategy';
import * as jwt from 'jsonwebtoken';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { TokenResponse } from './auth.interface';
import { Auth, GetUserId } from './auth.guard';
import { AuthService } from './auth.service';
import { authDto } from '../user/user.dto';
@Controller('auth')
export class AuthController {
  constructor(
    public readonly jwtstrategy: JwtStrategy,
    public readonly authService: AuthService,
  ) {}

  @Get('/token/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Update nonce' })
  async tokendetails(@Param('token') token: string): Promise<any> {
    console.log(token);
    const ans = <JwtPayload>jwt.verify(token, 'SummontoWork#8769163');
    let isuserValidatedwithPlayload = await this.jwtstrategy.validate(ans);
    return isuserValidatedwithPlayload;
  }

  @Post('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TokenResponse,
    description: 'Authentication of token',
  })
  async auth(@Body() auth: authDto) {
    return await this.authService.auth(auth);
  }
}
