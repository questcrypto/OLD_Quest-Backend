import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './modules/config/config.module';
import { UserModule } from './modules/user/user.module';
import { EmailModule } from './modules/emails/emails.module';
// import configuration from './config/configuration';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { ConfigService } from './Services/config.service';
// import ConfigService from './Services/config.service';
// import { UserRepository } from './modules/user/user.repository';
import { PropertiesModule } from './modules/properties/properties.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { dirname, join } from 'path';
import { AuctionModule } from './modules/auction/auction.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { WebsocketGateway } from './modules/websocket/websocket.gateway';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath:join(__dirname,'..','upload'),
      serveStaticOptions:{
        index:false,
      },

    }),
    ConfigModule,
    UserModule,
    PropertiesModule,
    EmailModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.getTypeORMConfig(),
      inject: [ConfigService],
    }),

    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
    AuctionModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports:[UserService]
})
export class AppModule {}
