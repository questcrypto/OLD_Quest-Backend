import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authDto } from 'modules/user/user.dto';
import { getUserBy } from '../user/user.repository';
import { TokenResponse, JwtPayload } from './auth.interface';
import jwt_decode from "jwt-decode";


@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
      private jwtService: JwtService,
    ) {}

    async auth({token}:authDto) {
      if(!token) return {token:null}
      let decoded:any = jwt_decode(token);
      const user = await getUserBy({id:decoded.id})
      if (!user) throw new BadRequestException('user not found..')
       const result = await this.generateToken(
        user.id,
        user.publicaddress,
        user.email,
        user.role
       )
      return { token:result }
    }

    async generateToken(id,publicaddress, email, role): Promise<string> {
      const payload: JwtPayload = { id,publicaddress,email,role }
      const token =  this.jwtService.sign(payload)
      return token
    }


}
