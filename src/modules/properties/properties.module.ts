import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorRepository, propertyCommentRepository, propertyFilesRepository, propertyRepository } from './properties.repository';
import { FloorDetail } from './properties.entity';
import { PropertyFilesDto } from './properties.dto';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import {EmailModule} from '../emails/emails.module'

@Module({
  imports:[
    TypeOrmModule.forFeature([
      propertyRepository,
    FloorRepository,
    propertyFilesRepository,
    propertyCommentRepository
    ]),EmailModule,
    AuthModule],
  providers: [PropertiesService],
  controllers: [PropertiesController],
  exports:[PropertiesService]
})
export class PropertiesModule {}
