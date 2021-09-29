import { BadRequestException } from '@nestjs/common';
import { getManyBy, getSingleBy } from '../../helper/helper';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { getPropertyBy } from '../properties/properties.repository';
import { AuctionBidDetails, AuctionEntity } from './auction.entity';

export const getAuctionBy = getSingleBy(AuctionEntity);

export const getBiddersBy = getManyBy(AuctionBidDetails);

export async function updateAuctionDetail(
  ownersComments,
  isApprovedByOwner,
  id,
  status,
) {
  const sql = `UPDATE auction_entity 
    SET "ownersComments" = $1 , "isApprovedByOwner" = $2, "status" = $4 where id = $3`;
  const result = await getConnection().query(sql, [
    ownersComments,
    isApprovedByOwner,
    id,
    status,
  ]);
  return result;
}

export async function activateAuctionDetail(id) {
  const sql = `UPDATE auction_entity 
    SET "isActive" = true , "status" = 2 where id = $1`;
  const result = await getConnection().query(sql, [id]);
  return result;
}

export async function setAuctionStatusFailed(id) {
  const sql = `UPDATE auction_entity 
    SET "status" = 4 where id = $1`;
  const result = await getConnection().query(sql, [id]);
  return result;
}

export async function getParticipatedAuction(publicAddress: string) {
  const sql = `SELECT "auction_bid_details"."auctionIDId" from auction_bid_details where "auction_bid_details"."biddersPublicAddress" = $1`;
  const result = await getConnection().query(sql, [publicAddress]);
  return result;
}

export async function getParticipatedEndAuction(publicAddress: string) {
  const sql = `SELECT "auction_bid_details"."auctionIDId" from auction_bid_details where "auction_bid_details"."biddersPublicAddress" = $1`;
  const result = await getConnection().query(sql, [publicAddress]);
  return result;
}

export async function getListOfAllActiveAuction(propId: string) {
  const sql = `SELECT * from auction_entity where "auction_entity"."status" = 2 and "auction_entity"."propidId"=$1 and "endDate" >= current_date `;
  const result = await getConnection().query(sql, [propId]);
  return result;
}

export async function getPreAuctionListForUser(propId: string) {
  const sql = `SELECT * from auction_entity where "auction_entity"."isActive" = false and "auction_entity"."propidId"=$1 and "startDate" > current_date `;
  const result = await getConnection().query(sql, [propId]);
  return result;
}

// ****************************************************
/*
This query return the list of auctions which are either completed or failed.
*/

export async function getEndAuctionList(propId: string) {
  const sql = `SELECT * from auction_entity where "auction_entity"."status" = 2 and "auction_entity"."propidId"=$1 and "endDate" <= current_date `;
  const result = await getConnection().query(sql, [propId]);
  return result;
}

export async function getUpcomingList(propId: string) {
  const sql = `SELECT * from auction_entity where "auction_entity"."status" = 2 and "auction_entity"."propidId"=$1 and "startDate" > current_date `;
  const result = await getConnection().query(sql, [propId]);
  return result;
}

// *****************************************************

export async function getOnAuctionListForUser(propId: string) {
  try {
    const sql = `SELECT * from auction_entity where "auction_entity"."isActive" = true and "auction_entity"."propidId"=$1 and "startDate" <= current_date and "status" = 2`;
    const result = await getConnection().query(sql, [propId]);
    return result;
  } catch (err) {
    throw new BadRequestException(err.message);
  }
}

export async function onGoingAllAuctionList(propId: string) {
  try {
    const sql = `SELECT * from auction_entity where "auction_entity"."isActive" = true and "auction_entity"."propidId"=$1 and "startDate" <= current_date and "endDate" >= current_date and "status" = 2`;
    const result = await getConnection().query(sql, [propId]);
    return result;
  } catch (err) {
    throw new BadRequestException(err.message);
  }
}

export async function getPreAuctionListForTreasury(propId: string) {
  const sql = `SELECT * from auction_entity where "auction_entity"."propidId"=$1 and ("auction_entity"."isActive" = false or "startDate" > current_date)`;
  const result = await getConnection().query(sql, [propId]);
  return result;
}

// -----------------GET List of pre Auction properties for Treasury Admin ------------------- //

export async function getListofPreAuctionforTreasury(propId: string) {
  const sql = `SELECT * from auction_entity where "auction_entity"."propidId"=$1 and ("auction_entity"."isActive" = false or "startDate" > current_date) `;
  const result = await getConnection().query(sql, [propId]);
  return result;
}

// ------------------------------------------ENDS HERE---------------------------------------//

// This function is to get list of non-participating auctions for other than property owners
export async function getListOfNonParticipatingAuction(
  listOfparticipatingAuction: string,
) {
  console.log(listOfparticipatingAuction);
  var array = [];

  if (listOfparticipatingAuction.length > 0) {
    var params = [];
    for (var i = 1; i <= listOfparticipatingAuction.length; i++) {
      params.push('$' + i);
    }
    const sql = `SELECT * from auction_entity where "auction_entity"."id" NOT IN (SELECT "auction_bid_details"."auctionIDId" from auction_bid_details where "auction_bid_details"."biddersPublicAddress" = $1) and "auction_entity"."endDate" > current_date and "auction_entity"."status" = 2 `;
    const result = await getConnection().query(sql, [
      listOfparticipatingAuction,
    ]);
    return result;
  } else {
    const sql = `SELECT * from auction_entity where "auction_entity".status = 2`;
    const result = await getConnection().query(sql);
    return result;
  }
}

export async function getDetailsofParticipatedAuction(
  listOfparticipatingAuction: string,
) {
  const sql = `SELECT * from auction_entity where "auction_entity"."id" IN (SELECT "auction_bid_details"."auctionIDId" from auction_bid_details where "auction_bid_details"."biddersPublicAddress" = $1) and "auction_entity"."endDate" > current_date `;
  const result = await getConnection().query(sql, [listOfparticipatingAuction]);
  return result;
}

export async function getDetailsofParticipatedCompletedAuction(
  listOfparticipatingAuction: string,
) {
  const sql = `SELECT * from auction_entity where "auction_entity"."id" IN (SELECT "auction_bid_details"."auctionIDId" from auction_bid_details where "auction_bid_details"."biddersPublicAddress" = $1) and "auction_entity"."endDate" <= current_date `;
  const result = await getConnection().query(sql, [listOfparticipatingAuction]);
  return result;
}

// Get details of particular auction

export async function getBidDetailsByAuctionId(id: string) {
  const sql = ` SELECT * from auction_bid_details where "auction_bid_details"."auctionIDId"= $1 `;
  const result = await getConnection().query(sql, [id]);
  return result;
}

export async function getBidDetailsByPropId(id: string) {
  const sql = ` SELECT * from auction_bid_details where "auction_bid_details"."propertyID"= $1 `;
  const result = await getConnection().query(sql, [id]);
  return result;
}

export async function getBidDetailsByAuctionIdandUserId(
  id: string,
  publicAddress,
) {
  const sql = ` SELECT * from auction_bid_details where "auction_bid_details"."auctionIDId"= $1 and "auction_bid_details"."biddersPublicAddress" =$2 `;
  const result = await getConnection().query(sql, [id, publicAddress]);
  const sql2 = `select AVG("bidPrice") as averageBid from "auction_bid_details" where "auction_bid_details"."auctionIDId" = $1`;
  const result2 = await getConnection().query(sql2, [id]);
  result.push({ averageBid: result2[0].averagebid });
  return result;
}

export async function getAvailableEquity(id: string) {
  const sql = `SELECT SUM("currentAllotment") as allotedEquity from "auction_bid_details" where "auction_bid_details"."auctionIDId"=$1`;
  const sql2 = `SELECT * from "auction_entity" WHERE "auction_entity"."id" = $1`;
  var remainingToken;
  const bidConfig = await getConnection().query(sql2, [id]);
  const result = await getConnection().query(sql, [id]);
  id = bidConfig[0].propidId;
  const propDetails = await getPropertyBy({ id });
  if (result[0].allotedequity != null) {
    remainingToken = propDetails.CurrentValue - result[0].allotedequity;
  } else {
    remainingToken = propDetails.CurrentValue;
  }
  return remainingToken;
}

export async function getTokensWhichCanbeAlloted(id: string, bidPrice: number) {
  const sql = `SELECT SUM("currentAllotment") as tokenBelowBidPrice from "auction_bid_details" where "auction_bid_details"."auctionIDId"=$1 and "auction_bid_details"."bidPrice" < $2 `;
  const result = await getConnection().query(sql, [id, bidPrice]);
  var tokenBelowBidPrice: number = 0;
  if (result[0].tokenbelowbidprice != null) {
    tokenBelowBidPrice = result[0].tokenbelowbidprice;
    return tokenBelowBidPrice;
  } else {
    return tokenBelowBidPrice;
  }
}

export async function getTokens(id: string, bidPrice: number) {
  const sql = `SELECT * from "auction_bid_details" where "auction_bid_details"."auctionIDId"=$1 and "auction_bid_details"."bidPrice" < $2 ORDER BY "UpdatedAt" desc`;
  const result = await getConnection().query(sql, [id, bidPrice]);
  return result;
}

export async function updateBids(
  id: string,
  currentAllotment: number,
  deficit: boolean,
  deposit: number,
) {
  console.log(id, currentAllotment, deficit, deposit);
  const sql = `UPDATE "auction_bid_details" SET "currentAllotment" = $2, "deficit" = $3, "deposit" = $4 where "auction_bid_details"."id" = $1`;
  const result = await getConnection().query(sql, [
    id,
    currentAllotment,
    deficit,
    deposit,
  ]);
  return result;
}

export async function getTokensWhichCannotBeAlloted(
  id: string,
  bidPrice: number,
) {
  const sql = `SELECT * from "auction_bid_details" where "auction_bid_details"."auctionIDId"=$1 and "auction_bid_details"."bidPrice" >= $2 `;
  const result = await getConnection().query(sql, [id, bidPrice]);
  return result;
}

export async function UpgradeBids(
  id: string,
  currentAllotment: number,
  deposit: number,
  totalAmountPaid: number,
  deficit: boolean,
  totalQty: number,
  bidPrice: number,
  biddersID: string,
) {
  const sql = `UPDATE "auction_bid_details" SET "currentAllotment" =$2, "deposit"=$3, "deficit" = $4,"totalAmountPaid" = $6, "totalQty"=$5,"bidPrice" = $7  where "auction_bid_details"."auctionIDId"=$1 and "auction_bid_details"."biddersPublicAddress" = $8`;
  const result = await getConnection().query(sql, [
    id,
    currentAllotment,
    deposit,
    deficit,
    totalQty,
    totalAmountPaid,
    bidPrice,
    biddersID,
  ]);
  return result;
}

export async function postAuctionList() {
  const sql = `select * from auction_entity where "endDate" < current_date and ("status" = 3 OR "status" = 4)`;
  const result = await getConnection().query(sql, []);
  return result;
}

export async function allPostAuctionList() {
  const sql = `select * from auction_entity where "endDate" < current_date and ("status" = 2 OR "status" = 3)`;
  const result = await getConnection().query(sql, []);
  return result;
}

export async function postAuctionListForUser(publicAddress: string) {
  const sql = `select * from auction_entity where "endDate" < current_date and ("status" = 3 OR "status" = 4) and "propidId" IN (select "id" from "property_entity" where "PublicAddress" =  $1 ); `;
  const result = await getConnection().query(sql, [publicAddress]);
  return result;
}

@EntityRepository(AuctionEntity)
export class auctionRepository extends Repository<AuctionEntity> {}

@EntityRepository(AuctionBidDetails)
export class auctionBidDetailsRepository extends Repository<
  AuctionBidDetails
> {}
