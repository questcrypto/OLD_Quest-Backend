import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  activateAuctionDTO,
  bidEligibilityDTO,
  configureAuctionDto,
  endAuctionDTO,
  makeBidDTO,
  myBidDTO,
  ownersActionDto,
} from './auction.dto';
import { BidStatus, makeBidIF } from './auction.interface';
import { AuctionService } from './auction.service';
import axios from 'axios';
@Controller('auction')
@ApiTags('Auction')
export class AuctionController {
  constructor(public readonly auctionService: AuctionService) {}

  @Post('/ConfigureAuction')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Configure New auction' })
  async configureAuction(@Body() configureAuctionDto: configureAuctionDto) {
    return await this.auctionService.configureAuction(configureAuctionDto);
  }

  @Post('/OwnersAction')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Owners action on auction request' })
  async ownersaction(@Body() ownersActionDto: ownersActionDto) {
    return this.auctionService.ownersAction(ownersActionDto);
  }

  @Post('/activateAuction')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Activate auction' })
  async activateAuction(@Body() activateAuctionDto: activateAuctionDTO) {
    return this.auctionService.activateAuction(activateAuctionDto);
  }

  @Get('/ListofNewAuction/:publicaddress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get Auctions which are new to Owner' })
  async newauctionconfig(@Param('publicaddress') publicaddress: string) {
    return this.auctionService.listofnewauciton(publicaddress);
  }

  @Get('listOfAllNewAuction')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get List of All Auctions' })
  async allnewauctionconfig() {
    return this.auctionService.listofAllewauciton();
  }

  @Get('listOfAllActiveAuction')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get List of All Auctions' })
  async allactiveauctionconfig() {
    return this.auctionService.onGoingAuctionAdmin();
  }

  @Get('AllonGoingAuctionList')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get List of All  on going Auctions' })
  async onGoingAllAuctionList() {
    return this.auctionService.onGoingAllAuctionList();
  }

  @Get('/myListOfActiveAuction/:publicaddress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get auction detail' })
  async myListOfActiveAuction(@Param('publicaddress') publicaddress: string) {
    return this.auctionService.onGoingAuctionUser(publicaddress);
  }

  @Get('NonParticipatedAuctions/:publicaddress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get auction detail' })
  async NonParticipatedAuctions(@Param('publicaddress') publicaddress: string) {
    return this.auctionService.listofNPOngoingAuctions(publicaddress);
  }

  @Get('getAuctionDetail/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get auction detail' })
  async getAuctionDetail(@Param('id') id: string) {
    return this.auctionService.getAuctionDetails(id);
  }

  // This is no the correct Operation we  have to use @Get with query param.
  @Post('/getEligibilty')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get Eligibility of Bid' })
  async getEligibiltyofBid(@Body() body: bidEligibilityDTO): Promise<any> {
    return this.auctionService.getBidEligibilty(body);
  }

  @Post('/makeBid')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Make Bid' })
  async makeBid(@Body() body: makeBidDTO): Promise<any> {
    return this.auctionService.makeBid(body);
  }

  @Get('/getListOfParticipatedAuctions/:publicAddress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get list of participated Auctions' })
  async getlistofparticipatedAuctions(
    @Param('publicAddress') publicAddress: string,
  ): Promise<any> {
    return await this.auctionService.getListOfParticipatedAuctions(
      publicAddress,
    );
  }

  @Post('/getListOfParticipatedAuctions')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get list of participated Auctions' })
  async myBidDetails(@Body() Body: myBidDTO): Promise<any> {
    return await this.auctionService.getDetailsOfParticipatedAccountBy(
      Body.id,
      Body.publicaddress,
    );
  }

  @Get('/getDetailsOfParticipatedAccountBy')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Details of the bid' })
  async getDetailsOfParticipatedAccountBy(
    @Query() query: myBidDTO,
  ): Promise<any> {
    return await this.auctionService.getDetailsOfParticipatedAccountBy(
      query.id,
      query.publicaddress,
    );
  }

  @Get('/getDetailsOfParticipatedCompletedAuction/:publicAddress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Details of the bid' })
  async getDetailsOfCompletedAuction(
    @Param('publicAddress') publicAddress: string,
  ): Promise<any> {
    return await this.auctionService.getCompletedAuction(publicAddress);
  }

  @Get('getAuctionStatus/:auctionID')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Details of Auction Status' })
  async getAuctionStatusDetails(
    @Param('auctionID') auctionID: string,
  ): Promise<any> {
    return await this.auctionService.getAuctionStatusDetails(auctionID);
  }

  @Post('/upgradeBid')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Upgrade the current bid' })
  async upgradeBid(@Body() body: makeBidDTO): Promise<any> {
    return await this.auctionService.upgradeBid(body);
  }

  @Post('/EndAuction')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'End Auction' })
  async EndAuction(@Body() endAuction: endAuctionDTO): Promise<any> {
    const { auctionID, auctionStatus } = endAuction;
    console.log('line136 => ' + auctionID + '  ' + auctionStatus);
    if (auctionStatus)
      return await this.auctionService.endAuction(
        auctionID,
        BidStatus.Completed,
      );
    else
      return await this.auctionService.endAuction(auctionID, BidStatus.Failed);
  }

  @Get('/getlistofendauction')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Upgrade the current bid' })
  async listofendauction(): Promise<any> {
    return await this.auctionService.getEndAuction();
  }

  @Get('/getupcomingauction')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List of upcoming auction' })
  async upcomingAuction(): Promise<any> {
    return await this.auctionService.getUpcomingAuction();
  }

  @Get('/getPostAuctionList')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List of upcoming auction' })
  async getpostauctionn(): Promise<any> {
    return await this.auctionService.postAuction();
  }

  @Get('/getAllEndAuctionList')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List of all End auction' })
  async AllPostAuction(): Promise<any> {
    return await this.auctionService.AllPostAuction();
  }

  @Get('/getPostAuctionListUser/:publicAddress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List of upcoming auction' })
  async getpostauctionuser(
    @Param('publicAddress') publicAddress: string,
  ): Promise<any> {
    return await this.auctionService.postAuctionForUser(publicAddress);
  }

  @Get('/getAutoFarmStats')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List of upcoming auction' })
  async getAUTOdata(): Promise<any> {
    var data: any = await axios.get(
      'https://static.autofarm.network/bsc/farm_data.json',
    );
    data = data.data;
    var result = {};
    var reslength = 0;
    data.table_data.forEach(element => {
      if (
        (element[2] === 'WBNB-AUTO LP' && element[3] === 'AUTO') ||
        element[2] === 'BUSD-USDT LP' ||
        element[2] === 'BUSD-VAI LP' ||
        element[2] === 'BUSD-USDC LP' ||
        element[2] === 'BUSD-DAI LP' ||
        element[2] === 'BUSD-UST LP' ||
        (element[2] === 'BUSD' && element[1] === '1.0x') ||
        (element[2] === 'USDT' && element[1] === '1.0x') ||
        (element[2] === 'USDC' && element[1] === '1.0x') ||
        (element[2] === 'DAI' && element[1] === '1.0x')
      ) {
        result[reslength++] = data.pools[element[0]];
      }
    });
    return result;
  }
}
