import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { configService } from '../../Services/config.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([
            UserRepository,
          ]),
          PassportModule.register({ defaultStrategy: 'jwt' }),
          JwtModule.register({
            secret: configService.getCommonfiles(),
            signOptions:{ expiresIn:604800}
         
          })
    ],
    providers:[JwtStrategy, AuthService],
    exports:[JwtStrategy,PassportModule,AuthService],
    controllers: [AuthController]
})
export class AuthModule {
    
}
