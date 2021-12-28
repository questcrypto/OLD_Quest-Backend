import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import IEnvConfigInterface from './env-config.interface';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as path from 'path';
@Injectable()
class ConfigService {
  private readonly envConfig: IEnvConfigInterface;
  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
    dotenv.config({
      path: `${this.envConfig.NODE_ENV}.env`,
    });
  }

  getenvConfig() {
    return this.envConfig;
  }

  public getCommonfiles(): any {
    const JWT_SECRET_KEY = this.envConfig.JWT_SECRET_KEY;
    return JWT_SECRET_KEY;
  }

  public getTypeORMConfig(): TypeOrmModuleOptions {
    const isCompiled = path.extname(__filename).includes('js');
    const baseDir = path.join(__dirname, '../');
    const entitiesPath = `${baseDir}${this.envConfig.TYPEORM_ENTITIES}`;
    const migrationPath = `${baseDir}${this.envConfig.TYPEORM_MIGRATIONS}`;
    const type: any = this.envConfig.TYPEORM_CONNECTION;
    return {
      type,
      host: this.envConfig.TYPEORM_HOST,
      username: this.envConfig.TYPEORM_USERNAME,
      password: this.envConfig.TYPEORM_PASSWORD,
      database: this.envConfig.TYPEORM_DATABASE,
      port: Number.parseInt(this.envConfig.TYPEORM_PORT, 10),
      ssl: true,
      logging: false,
      synchronize: false,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 2000,
      // entities: [`**/*.${isCompiled? "js" : "ts"}`],
      // migrations: [`src/migrations/**/*.${isCompiled? "js" : "ts"}`],
      // entities: [`src/entity/**/*.${isCompiled? "js" : "ts"}`],
      // migrations: [`src/migration/**/*.${isCompiled? "js" : "ts"}`],
      entities: [entitiesPath],
      migrations: [migrationPath],
      // migrationsRun: this.envConfig.TYPEORM_MIGRATIONS_RUN === 'true',
      // cli: {
      //   migrationsDir: 'src/db/migrations',
      //   entitiesDir: 'src/db/entities',
      // },
    };
  }
  /*
44
   Ensures all needed variables are set, and returns the validated JavaScript object
45
   including the applied default values.
46
  */
  private validateInput(envConfig: IEnvConfigInterface): IEnvConfigInterface {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'test')
        .default('development'),
      HTTP_PORT: Joi.number().required(),
    }).unknown(true);
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
const baseDir = path.join(__dirname, '../', '../');
const configService = new ConfigService(
  `${baseDir}/env/${process.env.NODE_ENV || 'development'}.env`,
);

export { ConfigService, configService };
