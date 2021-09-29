import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { configService } from '../../Services/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getCommonfiles(),
    });
  }

  async validate(payload: JwtPayload) {
    const { publicaddress } = payload;
    const user = await this.userRepository.findOne({ publicaddress });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
