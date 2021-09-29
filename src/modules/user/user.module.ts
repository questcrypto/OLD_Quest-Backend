import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userNonceRepository, UserRepository,userPassCodeRepository,randomUserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import {EmailsService} from '../emails/emails.service'
import {EmailModule} from '../emails/emails.module'

@Module({
  imports:[
    TypeOrmModule.forFeature([
      UserRepository,
      userNonceRepository,
      userPassCodeRepository,
      randomUserRepository
    ]),
    AuthModule,
    EmailModule],
  providers: [UserService],
  controllers: [UserController],
  exports:[UserService]
})
export class UserModule {}
