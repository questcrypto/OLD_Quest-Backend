import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserModule } from './modules/user/user.module';
import 'dotenv/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { ConfigModule } from './modules/config/config.module';
import { configureSwagger } from './swagger';
import { ConfigService } from './Services/config.service';
import { join } from 'path';
import { SocketIoAdapter } from './modules/websocket/adapters/radis-io.adapter';
import * as cors from 'cors';

console.log('join(__dirname, ../upload', join(__dirname, '../upload'));
async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.select(ConfigModule).get(ConfigService);
  console.log(join(__dirname, '/upload'));
  console.log(join(__dirname, '..', '/upload'));

  app.useStaticAssets(join(__dirname, '../upload'));

  if (['test', 'development'].includes(configService.getenvConfig().NODE_ENV)) {
    configureSwagger(app, configService);
  }

  app.useWebSocketAdapter(new SocketIoAdapter(app, true));

  app.use(cors());
  let env = configService.getenvConfig();
  console.log(env.HTTP_PORT);
  await app.listen(env.HTTP_PORT);
}
bootstrap();
