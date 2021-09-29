import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuctionModule } from './modules/auction/auction.module';
import { AuthModule } from './modules/auth/auth.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { UserModule } from './modules/user/user.module';
import { EmailModule } from './modules/emails/emails.module';
import { ConfigService } from './Services/config.service';
// import C from "./Services/config.service";

export function configureSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const config = new DocumentBuilder()
    .setTitle('Quest_Backend')
    .setDescription(`Quest Backend APIs`)
    .setVersion(`V.1.1`)
    .addTag('QST')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [
      UserModule,
      PropertiesModule,
      AuthModule,
      AuctionModule,
      EmailModule,
    ],
  });
  SwaggerModule.setup('api', app, document);
}
