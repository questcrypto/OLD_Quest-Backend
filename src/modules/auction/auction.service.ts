import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import {
  getmintedProperties,
  getPropertyBy,
  getAllmintedProperties,
  getBidConfig,
  getFileDetails,
} from '../properties/properties.repository';
import {
  ActivateAuctionIF,
  bidEligibilityIF,
  BidStatus,
  ConfigureAuctionIF,
  makeBidIF,
  OwnersActionIF,
} from './auction.interface';
import { PropertiesService } from '../properties/properties.service';
import {
  auctionRepository,
  getUpcomingList,
  getDetailsofParticipatedCompletedAuction,
  getOnAuctionListForUser,
  getEndAuctionList,
  onGoingAllAuctionList,
  getAuctionBy,
  UpgradeBids,
  updateAuctionDetail,
  getParticipatedAuction,
  getPreAuctionListForUser,
  getListOfNonParticipatingAuction,
  getBidDetailsByAuctionId,
  getAvailableEquity,
  getTokensWhichCanbeAlloted,
  getTokensWhichCannotBeAlloted,
  activateAuctionDetail,
  getListOfAllActiveAuction,
  auctionBidDetailsRepository,
  getTokens,
  updateBids,
  getBidDetailsByAuctionIdandUserId,
  getBidDetailsByPropId,
  getDetailsofParticipatedAuction,
  getBiddersBy,
  getListofPreAuctionforTreasury,
  getParticipatedEndAuction,
  postAuctionList,
  postAuctionListForUser,
  setAuctionStatusFailed,
  allPostAuctionList,
} from './auction.repository';
import { updateContactNumber, getUserBy } from '../user/user.repository';
import { EmailsService } from '../emails/emails.service';
import { NotificationType } from '../emails/notification.interface';

@Injectable()
export class AuctionService {
  constructor(
    public readonly auctionRepository: auctionRepository,
    public readonly propertyService: PropertiesService,
    public readonly auctionBidDetailsRepository: auctionBidDetailsRepository,
    public readonly notificationService: EmailsService,
  ) {}

  async configureAuction(configureAuction: ConfigureAuctionIF): Promise<any> {
    try {
      const id = configureAuction.propid;
      const propDetail = await getPropertyBy({ id });
      const auctionExist = await getAuctionBy({ id });
      if (propDetail) {
        if (
          !auctionExist ||
          auctionExist.status == BidStatus.Completed ||
          auctionExist.status == BidStatus.Failed
        ) {
          const auctionDetail = {
            id: v4(),
            propid: configureAuction.propid,
            startDate: configureAuction.startDate,
            endDate: configureAuction.endDate,
            minReserve: configureAuction.minReserve,
            slReserve: configureAuction.slReserve,
            suggestedLowestBid: configureAuction.suggestedLowestBid,
            memo: configureAuction.memo,
            isApprovedByOwner: false,
            isIssuedBy: configureAuction.isIssuedBy,
            isActive: false,
            status: BidStatus.Pending,
            isRead: false,
            ownersComment: '',
          };

          return await this.auctionRepository.insert(auctionDetail);
        } else {
          return {message: 'Auction exist for this property id already'};
        }
      } else {
        return { massage:'Property Does not exist'};
      }
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async ownersAction(ownersActionIF: OwnersActionIF): Promise<any> {
    try {
      const status = ownersActionIF.isApprovedByOwner == true ? 1 : 5;
      return await updateAuctionDetail(
        ownersActionIF.Comment,
        ownersActionIF.isApprovedByOwner,
        ownersActionIF.id,
        status,
      );
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async activateAuction(ActivateAuctionIF: ActivateAuctionIF): Promise<any> {
    try {
      return await activateAuctionDetail(ActivateAuctionIF.id);
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async listofnewauciton(publicAddress: string): Promise<any> {
    try {
      // Get list of all the properties whihc are minted
      const propID = await getmintedProperties(publicAddress);
      const ListofNewAuction = [];
      for (let i = 0; i < propID.length; i++) {
        let propid = propID[i].id;
        const value = await getPreAuctionListForUser(propid).then(async val => {
          if (val.length > 0) {
            if (val[0].isRead == false) {
              let doc = await getFileDetails(propid);
              propID[i]['getDoc'] = doc;
              ListofNewAuction.push({
                AuctionDetail: val,
                PropertyDetails: propID[i],
              });
            }
          }
          return val;
        });
      }
      return ListofNewAuction;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async listofAllewauciton(): Promise<any> {
    try {
      // Get list of all the properties whihc are minted
      const propID = await getAllmintedProperties();
      const ListofNewAuction = [];
      for (let i = 0; i < propID.length; i++) {
        let propid = propID[i].id;
        const value = await getListofPreAuctionforTreasury(propid).then(val => {
          if (val.length > 0) {
            if (val[0].isRead == false) {
              ListofNewAuction.push({
                AuctionDetail: val,
                PropertyDetails: propID[i],
              });
            }
          }
          return val;
        });
      }
      return ListofNewAuction;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async onGoingAuctionAdmin(): Promise<any> {
    try {
      const propID = await getAllmintedProperties();
      const ListofOngoingAuction = [];

      for (let i = 0; i < propID.length; i++) {
        let propid = propID[i].id;
        const value = await getOnAuctionListForUser(propid).then(val => {
          if (val.length > 0) {
            if (val[0].isRead == false) {
              ListofOngoingAuction.push({
                AuctionDetail: val,
                PropertyDetails: propID[i],
              });
            }
          }
          return val;
        });
      }
      return await ListofOngoingAuction;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async onGoingAllAuctionList(): Promise<any> {
    try {
      const propID = await getAllmintedProperties();
      const ListofOngoingAuction = [];

      for (let i = 0; i < propID.length; i++) {
        let propid = propID[i].id;
        let propDetail = await this.propertyService.GetPropertyByID(propid);
        const value = await onGoingAllAuctionList(propid).then(val => {
          if (val.length > 0) {
            if (val[0].isRead == false) {
              ListofOngoingAuction.push({
                AuctionDetail: val[0],
                PropertyDetails: propDetail,
              });
            }
          }
          return val;
        });
      }
      return await ListofOngoingAuction;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async onGoingAuctionUser(publicaddress: string): Promise<any> {
    try {
      const propID = await getmintedProperties(publicaddress);
      const ListofOngoingAuction = [];
      for (let i = 0; i < propID.length; i++) {
        let propid = propID[i].id;
        const value = await getOnAuctionListForUser(propid).then(async val => {
          if (val.length > 0) {
            let doc = await getFileDetails(propid);
            propID[i]['getDoc'] = doc;
            ListofOngoingAuction.push({
              AuctionDetail: val,
              PropertyDetails: propID[i],
            });
          }
          return val;
        });
      }
      return ListofOngoingAuction;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  // This function is to get list of non-participating auctions for other than property owners
  async listofNPOngoingAuctions(publicAddress: string): Promise<any> {
    try {
      const ListofNPOngoingAuction = [];
      const participatingAuctions = await getParticipatedAuction(publicAddress);
      console.log(participatingAuctions);
      const listOfNonParticipationAuction = await getListOfNonParticipatingAuction(
        publicAddress,
      );
      for (let i = 0; i < listOfNonParticipationAuction.length; i++) {
        let id = listOfNonParticipationAuction[i].propidId;
        let propDetail = await this.propertyService
          .GetPropertyByID(id)
          .then(val => {
            ListofNPOngoingAuction.push({
              AuctionDetail: listOfNonParticipationAuction[i],
              PropertyDetails: val,
            });
          });
      }
      return ListofNPOngoingAuction;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  // Get details of auction for that particular property

  async getAuctionDetails(id: string): Promise<any> {
    try {
      const auctionDetails = await getBidConfig(id);
      console.log(auctionDetails);
      const bidDetails = await getBidDetailsByAuctionId(id);
      id = auctionDetails[0].propidId;
      const EligibleBids = bidDetails.filter(element => {
        return element.currentAllotment > 0;
      });

      const propertDetail = await this.propertyService.GetPropertyByID(id);
      const bidStats = {
        totalBidders: 0,
        eligibleBids: 0,
        totalTokensSold: 0,
        amountRaised: 0,
      };
      for (let i = 0; i < bidDetails.length; i++) {
        bidStats.totalTokensSold =
          bidStats.totalTokensSold + bidDetails[i].currentAllotment;
        bidStats.amountRaised =
          bidStats.amountRaised +
          bidDetails[i].currentAllotment * bidDetails[i].bidPrice;
      }
      if (bidDetails.length > 0) {
        (bidStats.totalBidders = bidDetails.length),
          (bidStats.eligibleBids = EligibleBids.length);
      }
      const result = {
        propertyDetail: propertDetail,
        auctionDetails: auctionDetails,
        bidStats: bidStats,
      };
      return result;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  // getBidEligibilty => this function returns what should be the minimum bid to purchase the tokens.
  async getBidEligibilty(bidEligibility: bidEligibilityIF): Promise<any> {
    let minimumBidPriceForSelectedToken = bidEligibility.bidPrice;
    const availableTokens = await getAvailableEquity(bidEligibility.id);
    if (availableTokens < bidEligibility.totalQuantity) {
      const getTokenBelowBidPrice = await getTokensWhichCanbeAlloted(
        bidEligibility.id,
        bidEligibility.bidPrice,
      );
      if (
        availableTokens + getTokenBelowBidPrice <
        bidEligibility.totalQuantity
      ) {
        const listOfBidsAboveBidPrice = await getTokensWhichCannotBeAlloted(
          bidEligibility.id,
          bidEligibility.bidPrice,
        );
        if (listOfBidsAboveBidPrice.length > 0) {
          let minimumBidPriceForSelectedToken = 0;
          let totalDeficit =
            bidEligibility.totalQuantity -
            (availableTokens + getTokenBelowBidPrice);
          listOfBidsAboveBidPrice.sort(function(a, b) {
            return a.bidPrice - b.bidPrice;
          });
          var i = 0;
          while (totalDeficit > 0) {
            if (totalDeficit > listOfBidsAboveBidPrice[i].currentAllotment) {
              totalDeficit =
                totalDeficit - listOfBidsAboveBidPrice[i].currentAllotment;
              minimumBidPriceForSelectedToken =
                listOfBidsAboveBidPrice[i].bidPrice;
              i = i + 1;
            } else {
              totalDeficit = 0;
              minimumBidPriceForSelectedToken =
                listOfBidsAboveBidPrice[i].bidPrice;
              i = i + 1;
            }
          }
          return minimumBidPriceForSelectedToken + 0.1;
        }
      }
    }
    return minimumBidPriceForSelectedToken;
  }
  // GetBidEligibity ends here
  async upgradeBid(makebid: makeBidIF): Promise<any> {
    try {
      // Check whether the available credits are there or not
      const availableTokens = await getAvailableEquity(makebid.auctionID);
      const id = makebid.propertyID;
      const propertDetail = await getPropertyBy({ id });
      let userDeposit = 0; // Defining userDeposit and deficit varriable
      let deficit = false;
      let totalQty = 0;
      let totalAmountPaid = makebid.initialAllotedTokens * makebid.bidPrice;
      // If available tokens are less then the required tokens transfer tokens from the account which have less
      if (availableTokens < makebid.initialAllotedTokens) {
        let currentAllotment = availableTokens;
        const lowerBids = await getTokens(makebid.auctionID, makebid.bidPrice);
        lowerBids.sort(function(a, b) {
          return a.bidPrice - b.bidPrice;
        });
        var i = 0;
        while (
          currentAllotment != makebid.initialAllotedTokens ||
          lowerBids.length != i
        ) {
          if (
            lowerBids[i].currentAllotment <=
            makebid.initialAllotedTokens - currentAllotment
          ) {
            let tempCurrAllotment = 0;
            let tempid = lowerBids[i].id;
            let deficit = true;
            let deposit =
              lowerBids[i].deposit +
              lowerBids[i].currentAllotment * lowerBids[i].bidPrice;
            await updateBids(tempid, tempCurrAllotment, deficit, deposit);
            currentAllotment = currentAllotment + lowerBids[i].currentAllotment;
            i = i + 1;
          } else {
            let tempCurrAllotment =
              lowerBids[i].currentAllotment -
              (makebid.initialAllotedTokens - currentAllotment);
            let tempid = lowerBids[i].id;
            let deficit = true;
            let deposit =
              lowerBids[i].deposit +
              (makebid.initialAllotedTokens - currentAllotment) *
                lowerBids[i].bidPrice;
            await updateBids(tempid, tempCurrAllotment, deficit, deposit);
            currentAllotment =
              currentAllotment +
              (makebid.initialAllotedTokens - currentAllotment);
            i = i + 1;
          }
        }
        // Update statement below this

        if (currentAllotment < makebid.initialAllotedTokens) {
          userDeposit =
            (makebid.initialAllotedTokens - currentAllotment) *
            makebid.bidPrice;
          deficit = true;
        }
        await UpgradeBids(
          makebid.auctionID,
          currentAllotment,
          userDeposit,
          totalAmountPaid,
          deficit,
          currentAllotment,
          makebid.bidPrice,
          makebid.biddersID,
        );
        //const user = await getUserBy({publicaddress:makebid.biddersID})
        //  await this.notificationService.notifications(

        //     user.id,
        //     'A bid is Upgraded',
        //     NotificationType.upgradeBid,
        //  )

        return { message: 'Upgrade was successfull' };
      } else {
        //  Update the values
        await UpgradeBids(
          makebid.auctionID,
          makebid.initialAllotedTokens,
          userDeposit,
          totalAmountPaid,
          deficit,
          makebid.initialAllotedTokens,
          makebid.bidPrice,
          makebid.biddersID,
        );
        // const user = await getUserBy({publicaddress:makebid.biddersID})
        //  await this.notificationService.notifications(

        //     user.id,
        //     'A bid is Upgraded',
        //     NotificationType.upgradeBid,
        //  )
        return { message: 'Upgrade was successfull' };
      }
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }
  // placeBid => This function places bid for the users

  async makeBid(makebid: makeBidIF): Promise<any> {
    try {
      const availableTokens = await getAvailableEquity(makebid.auctionID);
      console.log(availableTokens);
      if (makebid.contactNumber) {
        await updateContactNumber(makebid.contactNumber, makebid.biddersID);
      }
      let id = makebid.propertyID;
      const propertDetail = await getPropertyBy({ id });
      if (availableTokens < makebid.initialAllotedTokens) {
        // Some code here
        let currentAllotment = availableTokens;
        let lowerBids = await getTokens(makebid.auctionID, makebid.bidPrice);
        lowerBids.sort(function(a, b) {
          return a.bidPrice - b.bidPrice;
        });
        var i = 0;
        while (
          currentAllotment != makebid.initialAllotedTokens ||
          lowerBids.length != i
        ) {
          if (
            lowerBids[i].currentAllotment <=
            makebid.initialAllotedTokens - currentAllotment
          ) {
            let tempCurrAllotment = 0;
            let tempid = lowerBids[i].id;
            let deficit = true;
            let deposit =
              lowerBids[i].deposit +
              lowerBids[i].currentAllotment * lowerBids[i].bidPrice;
            await updateBids(tempid, tempCurrAllotment, deficit, deposit);
            currentAllotment = currentAllotment + lowerBids[i].currentAllotment;
            i = i + 1;
          } else {
            let tempCurrAllotment =
              lowerBids[i].currentAllotment -
              (makebid.initialAllotedTokens - currentAllotment);
            let tempid = lowerBids[i].id;
            let deficit = true;
            let deposit =
              lowerBids[i].deposit +
              (makebid.initialAllotedTokens - currentAllotment) *
                lowerBids[i].bidPrice;
            await updateBids(tempid, tempCurrAllotment, deficit, deposit);
            currentAllotment =
              currentAllotment +
              (makebid.initialAllotedTokens - currentAllotment);
            i = i + 1;
          }
        }
        const data = {
          id: v4(),
          auctionID: makebid.auctionID,
          biddersPublicAddress: makebid.biddersID,
          totalQty: currentAllotment,
          bidPrice: makebid.bidPrice,
          totalAmountPaid: makebid.totalAmount,
          propertyID: makebid.propertyID,
          initialAllotedTokens: makebid.initialAllotedTokens,
          currentAllotment: currentAllotment,
          deficit:
            makebid.initialAllotedTokens - currentAllotment > 0 ? true : false,
          bidStatus: BidStatus.Ongoing,
          deposit:
            (makebid.initialAllotedTokens - currentAllotment) *
            makebid.bidPrice,
        };
        await this.auctionBidDetailsRepository.insert(data);

        const user = await getUserBy({ publicaddress: makebid.biddersID });
        let name = user.name;
        let PropertyName = propertDetail.PropertyName;
        const context = { name, PropertyName };
        await this.notificationService.sendEmail(
          user.email,
          'Successful bidding confirmation',
          context,
          'successfulBid.hbs',
        );
        await this.notificationService.notifications(
          user.id,
          'your bid for Property : ' +
            propertDetail.PropertyName +
            ' is successful',
          NotificationType.sucessfulBid,
        );
        return { message: 'your bid is successful !!' };
      } else {
        const data = {
          id: v4(),
          auctionID: makebid.auctionID,
          biddersPublicAddress: makebid.biddersID,
          totalQty: makebid.initialAllotedTokens,
          bidPrice: makebid.bidPrice,
          totalAmountPaid: makebid.totalAmount,
          propertyID: makebid.propertyID,
          initialAllotedTokens: makebid.initialAllotedTokens,
          currentAllotment: makebid.initialAllotedTokens,
          deficit: false,
          bidStatus: BidStatus.Ongoing,
          deposit: 0,
        };
        console.log(data);
        await this.auctionBidDetailsRepository.insert(data);
        const user = await getUserBy({ publicaddress: makebid.biddersID });
        let name = user.name;
        let PropertyName = propertDetail.PropertyName;
        const context = { name, PropertyName };
        await this.notificationService.sendEmail(
          user.email,
          'Successful bidding confirmation',
          context,
          'successfulBid.hbs',
        );
        await this.notificationService.notifications(
          user.id,
          'your bid for Property : ' +
            propertDetail.PropertyName +
            ' is successful',
          NotificationType.sucessfulBid,
        );
        return { message: 'your bid is successful!' };
      }
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }
  // Ends here

  // Create a service to get list of all the participated bid

  async getListOfParticipatedAuctions(publicAddress: string): Promise<any> {
    const details = await getDetailsofParticipatedAuction(publicAddress);
    const listOfParticipatedAuctions = [];
    //  console.log(participatingAuctions)
    if (details.length > 0) {
      for (var i = 0; i < details.length; i++) {
        let id = details[i].propidId;
        let bidDetails = await getBidDetailsByAuctionIdandUserId(
          details[i].id,
          publicAddress,
        );
        let auctionDetails = await getBidConfig(details[i].id);
        let propDetail = await this.propertyService
          .GetPropertyByID(id)
          .then(val => {
            listOfParticipatedAuctions.push({
              PropertyDetails: val,
              bidDetails: bidDetails,
              auctionDetail: auctionDetails,
            });
          });
      }
    }

    return listOfParticipatedAuctions;
  }
  // Ends here
  // This function calls the
  async getDetailsOfParticipatedAccountBy(
    id: string,
    publicaddress: string,
  ): Promise<any> {
    try {
      const myBidDetails = await getBidDetailsByAuctionIdandUserId(
        id,
        publicaddress,
      );
      const auctionDetails = await getBidConfig(id);
      const bidDetails = await getBidDetailsByAuctionId(id);
      id = auctionDetails[0].propidId;
      const EligibleBids = bidDetails.filter(element => {
        return element.currentAllotment > 0;
      });

      const propertDetail = await this.propertyService.GetPropertyByID(id);
      const bidStats = {
        totalBidders: 0,
        eligibleBids: 0,
        totalTokensSold: 0,
        amountRaised: 0,
      };
      for (let i = 0; i < bidDetails.length; i++) {
        bidStats.totalTokensSold =
          bidStats.totalTokensSold + bidDetails[i].currentAllotment;
        bidStats.amountRaised =
          bidStats.amountRaised +
          bidDetails[i].currentAllotment * bidDetails[i].bidPrice;
      }
      if (bidDetails.length > 0) {
        (bidStats.totalBidders = bidDetails.length),
          (bidStats.eligibleBids = EligibleBids.length);
      }
      const result = {
        propertyDetail: propertDetail,
        auctionDetails: auctionDetails,
        bidStats: bidStats,
        myBidDetails: myBidDetails,
      };
      return result;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  // Get Details of Completed auction
  async getCompletedAuction(publicAddress: string): Promise<any> {
    try {
      const details = await getDetailsofParticipatedCompletedAuction(
        publicAddress,
      );
      const listOfParticipatedAuctions = [];
      //  console.log(participatingAuctions);
      console.log(details);
      if (details.length > 0) {
        for (let i = 0; i < details.length; i++) {
          let auctionDetails = await getBidConfig(details[i].id);
          if (
            auctionDetails[0].endDate < new Date() &&
            (auctionDetails[0].status == 4 || auctionDetails[0].status == 3)
          ) {
            let bidDetails = await getBidDetailsByAuctionIdandUserId(
              details[i].id,
              publicAddress,
            );
            let id = details[i].propidId;
            let propDetail = await this.propertyService
              .GetPropertyByID(id)
              .then(val => {
                listOfParticipatedAuctions.push({
                  PropertyDetails: val,
                  bidDetails: bidDetails,
                  auctionDetail: auctionDetails,
                });
              });
          }
        }
      }

      return listOfParticipatedAuctions;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }
  // Ends here

  async getAuctionStatusDetails(auctionID: string): Promise<any> {
    try {
      let auctionExist = await getAuctionBy({ id: auctionID });
      if (auctionExist) {
        let reserve_amount = auctionExist.minReserve + auctionExist.slReserve;
        let temp = await getBiddersBy({ auctionID: auctionID });
        if (temp.length) {
          let eligibleBids = 0;
          let eligibleBidsAmount = 0;
          let totalBiddingAmount = 0;
          let amount = 0;
          let reservePriceMet = false;
          temp.forEach(element => {
            if (element.currentAllotment != 0) {
              eligibleBids++;
              eligibleBidsAmount += element.currentAllotment;
              amount += element.currentAllotment * element.bidPrice;
            }
            totalBiddingAmount += element.totalAmountPaid;
          });
          if (amount >= reserve_amount) {
            reservePriceMet = true;
          }
          return {
            reserveAmount: reserve_amount,
            totalBidders: temp.length,
            totalBiddingAmount: totalBiddingAmount,
            eligibleBids: eligibleBids,
            eligibleBidAmount: eligibleBidsAmount,
            reservePriceMet: reservePriceMet,
            startDate: auctionExist.startDate,
            endDate: auctionExist.endDate,
          };
        } else {
          return {
            reserveAmount: reserve_amount,
            totalBidders: 0,
            totalBiddingAmount: 0,
            eligibleBids: 0,
            eligibleBidAmount: 0,
            reservePriceMet: false,
            startDate: auctionExist.startDate,
            endDate: auctionExist.endDate,
          };
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async endAuction(auctionID: string, auctionStatus: number): Promise<any> {
    try {
      const auctionExist = await getAuctionBy({ id: auctionID });
      if (auctionExist) {
        await this.auctionRepository.update(
          { id: auctionID },
          { status: auctionStatus },
        );
        if (auctionStatus == BidStatus.Completed) {
          /*
           *Store Amount of dai which Bidders can claim if auction
           *is completed and there are higher bids in comparsion
           *to existing Bids.
           *
           *Return two arrays:-
           *1)Bidder Address Array:-
           *[0xF51632261987F4578425Ca91a48117E11516a4CF,
           *0xA499569422a00d7f612ab91a47B3cb8C6Be71884,
           *0x1682Df81Cfae0DABb7CF2d2ecd9D011E355C3ebf]
           *2)Amount which above array elements can claim:-
           *[123,1234,3456]
           *for eg.
           *this address(0xA499569422a00d7f612ab91a47B3cb8C6Be71884)
           *can only claim 1234 DAI tokens
           */

          /*
           * If Auction is ended successfully return two arrays more
           *1)Auction Winners Address Array:-
           *[0xF51632261987F4578425Ca91a48117E11516a4CF,
           *0xA499569422a00d7f612ab91a47B3cb8C6Be71884,
           *0x1682Df81Cfae0DABb7CF2d2ecd9D011E355C3ebf]
           *2)Amount of tokens which above array elements has win:-
           *[123,1234,3456]
           *for eg.
           *this address(0xA499569422a00d7f612ab91a47B3cb8C6Be71884)
           *can only claim 1234 SLC or Auction tokens
           */
          const obj = {
            Auction_Winners_Array: [],
            Auction_Winner_Amount_Array: [],
            Claimers_Address_Array: [],
            Claimers_Amount_Array: [],
          };
          const Claimer_Array = [],
            Claim_Amount_Array = [];
          const Auc_Win_Array = [],
            Auc_Win_Amount_Array = [];

          let temp = await getBiddersBy({ auctionID: auctionID });
          temp.forEach(element => {
            if (element.deficit == true && element.deposit != 0) {
              Claimer_Array.push(element.biddersPublicAddress);
              Claim_Amount_Array.push(element.deposit);
            }
            if (element.currentAllotment != 0) {
              Auc_Win_Array.push(element.biddersPublicAddress);
              Auc_Win_Amount_Array.push(element.currentAllotment);
            }
          });
          obj.Claimers_Address_Array = Claimer_Array;
          obj.Claimers_Amount_Array = Claim_Amount_Array;
          obj.Auction_Winners_Array = Auc_Win_Array;
          obj.Auction_Winner_Amount_Array = Auc_Win_Amount_Array;
          return obj;
        } else if (auctionStatus == BidStatus.Failed) {
          /*
           *Store Amount of dai which Bidders can claim if auction
           *is completed and there are higher bids in comparsion
           *to existing Bids.
           *
           *Return two arrays:-
           *1)Bidder Address Array:-
           *[0xF51632261987F4578425Ca91a48117E11516a4CF,
           *0xA499569422a00d7f612ab91a47B3cb8C6Be71884,
           *0x1682Df81Cfae0DABb7CF2d2ecd9D011E355C3ebf]
           *2)Amount which above array elements can claim:-
           *[123,1234,3456]
           *for eg.
           *this address(0xA499569422a00d7f612ab91a47B3cb8C6Be71884)
           *can only claim 1234 DAI tokens
           */
          let bidders = await this.auctionBidDetailsRepository.find({
            auctionID: auctionID,
          });
          bidders.forEach(async element => {
            await this.auctionBidDetailsRepository.update(
              { id: element.id },
              { currentAllotment: 0, deposit: element.totalAmountPaid },
            );
          });
          await setAuctionStatusFailed(auctionID);
          const obj1 = {
            Claimers_Address_Array: [],
            Claimers_Amount_Array: [],
          };
          const Claimer_Array = [],
            Claim_Amount_Array = [];
          let temp = await getBiddersBy({ auctionID: auctionID });
          temp.forEach(element => {
            Claimer_Array.push(element.biddersPublicAddress);
            Claim_Amount_Array.push(element.totalAmountPaid);
          });
          obj1.Claimers_Address_Array = Claimer_Array;
          obj1.Claimers_Amount_Array = Claim_Amount_Array;
          return obj1;
        }
      }
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  // --------------- Service ENDS A.10 ---------------------------------

  // -------------------------Service A.11 -----------------------------------

  /*
This service is used to get the list of all the auction which are accomplished 
irrespective whether it was succesfull or failed, this incldues property detail
as well as auction detail. We are using auction_bid_details table for getting the
details.
*/

  async getEndAuction(): Promise<any> {
    try {
      const propID = await getAllmintedProperties();
      const ListofEndAuction = [];
      for (let i = 0; i < propID.length; i++) {
        let propid = propID[i].id;
        const value = await getEndAuctionList(propid).then(async val => {
          if (val.length > 0) {
            let doc = await getFileDetails(propid);
            propID[i]['getDoc'] = doc;
            ListofEndAuction.push({
              AuctionDetail: val,
              PropertyDetails: propID[i],
            });
          }
          return val;
        });
      }
      return ListofEndAuction;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }
  // --------------------------Service Sends Here-------------------------------

  async getUpcomingAuction(): Promise<any> {
    try {
      const propID = await getAllmintedProperties();
      const ListofUpcomingAuction = [];
      for (let i = 0; i < propID.length; i++) {
        let propid = propID[i].id;
        const value = await getUpcomingList(propid).then(async val => {
          if (val.length > 0) {
            let doc = await getFileDetails(propid);
            propID[i]['getDoc'] = doc;
            ListofUpcomingAuction.push({
              AuctionDetail: val,
              PropertyDetails: propID[i],
            });
          }
          return val;
        });
      }
      return ListofUpcomingAuction;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async postAuction(): Promise<any> {
    try {
      const listOfPostAuction = await postAuctionList();
      var details = [];
      for (let i = 0; i < listOfPostAuction.length; i++) {
        let id = listOfPostAuction[i].propidId;
        let propertyDetails = await getPropertyBy({ id });
        let doc = await getFileDetails(id);
        propertyDetails['getDoc'] = doc;
        details.push({
          AuctionDetail: [listOfPostAuction[i]],
          PropertyDetails: propertyDetails,
        });
      }
      return details;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async AllPostAuction(): Promise<any> {
    try {
      const listOfPostAuction = await allPostAuctionList();
      var details = [];
      for (let i = 0; i < listOfPostAuction.length; i++) {
        let id = listOfPostAuction[i].propidId;
        let propDetail = await this.propertyService.GetPropertyByID(id);
        const bidDetails = await getBidDetailsByPropId(id);
        details.push({
          PropertyDetails: propDetail,
          bidDetails: bidDetails,
          AuctionDetail: [listOfPostAuction[i]],
        });
      }
      return details;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async postAuctionForUser(publicAddress: string): Promise<any> {
    try {
      const listOfPostAuction = await postAuctionListForUser(publicAddress);
      const details = [];
      for (let i = 0; i < listOfPostAuction.length; i++) {
        let id = listOfPostAuction[i].propidId;
        let propertyDetails = await getPropertyBy({ id });
        let doc = await getFileDetails(id);
        propertyDetails['getDoc'] = doc;
        details.push({
          AuctionDetail: [listOfPostAuction[i]],
          PropertyDetails: propertyDetails,
        });
      }
      return details;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  // Service Ends below this
}
