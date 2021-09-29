import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../emails/emails.module';
import { AuthModule } from '../auth/auth.module';
import { PropertiesModule } from '../properties/properties.module';
import { AuctionController } from './auction.controller';
import { auctionBidDetailsRepository, auctionRepository } from './auction.repository';
import { AuctionService } from './auction.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([
auctionRepository,
auctionBidDetailsRepository
    ]),
    AuthModule,
    PropertiesModule,
    EmailModule
  ],
  providers:[AuctionService],
  controllers: [AuctionController],
  exports:[AuctionService]
})
export class AuctionModule {}
