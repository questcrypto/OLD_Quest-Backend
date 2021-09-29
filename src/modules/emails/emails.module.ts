import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import {NotificationRepository} from './notification.repository';
import{ WebsocketModule} from '../websocket/websocket.module'

@Module({
  imports:[
    TypeOrmModule.forFeature([
      NotificationRepository
    ]),
    WebsocketModule,
    AuthModule],
  providers: [EmailsService],
  controllers: [EmailsController],
  exports:[EmailsService]
})
export class EmailModule {}
