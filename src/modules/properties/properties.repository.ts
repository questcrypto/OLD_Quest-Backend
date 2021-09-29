import { async } from 'rxjs';
import { getSingleBy } from '../../helper/helper';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { FloorDetailDTO, PropertyComment } from './properties.dto';
import {
  FloorDetail,
  PropertyComments,
  PropertyEntity,
  propertyFiles,
} from './properties.entity';

export async function getPropertyByPublicAddress(PublicAddress: string) {
  const sql = `
          SELECT * FROM property_entity
          where "property_entity"."PublicAddress"= $1 and "property_entity"."ApprovedByOwner"= false`;
  const result = await getConnection().query(sql, [PublicAddress]);
  return result;
}

export async function getpublishedpropertybyID(PublicAddress: string) {
  const sql = `
          SELECT * FROM property_entity
          where "property_entity"."PublicAddress"= $1 and "property_entity"."ApprovedByOwner"= true and "property_entity"."ApprovedByOwner"= true`;
  const result = await getConnection().query(sql, [PublicAddress]);
  return result;
}

export async function getAllProperty() {
  const sql = `
          SELECT * FROM property_entity
          where "property_entity"."ApprovedByOwner"= false`;
  const result = await getConnection().query(sql);
  return result;
}

export async function getAllProperties() {
  const sql = `
          SELECT * FROM property_entity
          `;
  const result = await getConnection().query(sql);
  return result;
}

export async function getFloorDetails(id: string) {
  const sql = `
          SELECT * FROM floor_detail
          where "floor_detail"."propidId"= $1 `;
  const result = await getConnection().query(sql, [id]);
  return result;
}

export async function getFileDetails(id: string) {
  const sql = `
          SELECT * FROM property_files
          where "property_files"."propidId"= $1 `;
  const result = await getConnection().query(sql, [id]);
  return result;
}

export async function getCommentByID(id: string, Field: number) {
  const sql = `
  select * from property_comments where "property_comments"."propidId"=$1 and "property_comments"."Field"=$2 `;
  const result = await getConnection().query(sql, [id, Field]);
  return result;
}

export async function updateIsread(
  id: string,
  Field: number,
  publicAddress: string,
) {
  const sql = `
  update property_comments SET "Isread" = true where "property_comments"."propidId"=$1 and "property_comments"."Field"=$2 and "property_comments"."CommentedBy" !=$3 `;
  const result = await getConnection().query(sql, [id, Field, publicAddress]);
  return result;
}

export async function GetApprovedPropertyByPropertyOnwer(
  publicAddress: string,
) {
  const sql = `SELECT * FROM property_entity
  where "property_entity"."PublicAddress"= $1 and "property_entity"."ApprovedByOwner"= true and "property_entity"."ApprovedByHOA" = false`;
  const result = await getConnection().query(sql, [publicAddress]);
  return result;
}

export async function GetApprovedPropertyForHOAAdmin() {
  const sql = `SELECT * FROM property_entity
  where "property_entity"."ApprovedByOwner"= true and "property_entity"."ApprovedByHOA" = false `;
  const result = await getConnection().query(sql, []);
  return result;
}

export async function GetpublishedPropertiesForAdmins() {
  const sql = `SELECT * FROM property_entity
  where "property_entity"."ApprovedByOwner"= true  and "property_entity"."ApprovedByHOA" = true and "property_entity"."id" NOT IN ( SELECT "propidId" from "auction_entity")
  `;
  const result = await getConnection().query(sql, []);
  return result;
}

export async function fetchUnreadComment(id: string, publicAddress: string) {
  const sql = `select * from property_comments where "property_comments"."propidId" = $1 and "property_comments"."Isread" = false and "property_comments"."CommentedBy"!=$2 `;
  const result = await getConnection().query(sql, [id, publicAddress]);
  return result;
}
// Get published properties for owner
export async function GetPublishedPropertiesForOwners(publicAddress: string) {
  const sql = `select property_entity.* , "auction_entity"."isActive" as auctionStatus from "property_entity" LEFT JOIN "auction_entity" on "property_entity"."id" =  "auction_entity"."propidId" where "property_entity"."PublicAddress"= $1 and "property_entity"."ApprovedByOwner"= true  and "property_entity"."ApprovedByHOA" = true `;
  const result = await getConnection().query(sql, [publicAddress]);
  return result;
}

export async function GetAllPublishedProperties() {
  const sql = `select property_entity.* , "auction_entity"."isActive" as auctionStatus from "property_entity" LEFT JOIN "auction_entity" on "property_entity"."id" =  "auction_entity"."propidId"  where "property_entity"."ApprovedByOwner"= true  and "property_entity"."ApprovedByHOA" = true `;
  const result = await getConnection().query(sql, []);
  return result;
}

export async function getmintedProperties(publicAddress: string) {
  const sql = `SELECT * FROM property_entity
  WHERE "property_entity"."PublicAddress"= $1 and  "property_entity"."Isactive" = true `;
  const result = await getConnection().query(sql, [publicAddress]);
  return result;
}

export async function getAllmintedProperties() {
  const sql = `SELECT * FROM property_entity
  WHERE  "property_entity"."Isactive" = true `;
  const result = await getConnection().query(sql, []);
  return result;
}
// Update null value;
export async function updatenullvalues() {
  const sql = `UPDATE property_entity 
  SET 
  ApprovedByHOA = false where ApprovedByHOA = null `;
  const result = await getConnection().query(sql, []);

  return result;
}

export async function updateIsActive(id: string) {
  const sql = `UPDATE property_entity 
  SET 
  "Isactive" = true where "property_entity"."id" = $1 `;
  const result = await getConnection().query(sql, [id]);

  return result;
}

export async function getBidConfig(id: string) {
  const sql = ` SELECT * from auction_entity where "auction_entity"."id" = $1`;
  const result = await getConnection().query(sql, [id]);
  return result;
}

export async function getPropertyOnboardCount(id: string, role: number) {
  if (role == 2) {
    const sql = `SELECT count("ApprovedByHOA") as pending from "property_entity" where "PublicAddress"= $1 and "ApprovedByHOA"= false `;
    const sql2 = `SELECT count("ApprovedByHOA") as total from "property_entity" where "PublicAddress"=$1`;

    const result1 = await getConnection().query(sql, [id]);
    const result2 = await getConnection().query(sql2, [id]);
    return {
      pending: result1[0].pending,
      total: result2[0].total,
    };
  } else {
    const sql = `SELECT count("ApprovedByHOA") as pending from "property_entity" where "ApprovedByHOA"= false `;
    const sql2 = `SELECT count("ApprovedByHOA") as total from "property_entity"`;
    const result1 = await getConnection().query(sql, []);
    const result2 = await getConnection().query(sql2, []);
    return {
      pending: result1[0].pending,
      total: result2[0].total,
    };
  }
}
export const getPropertyBy = getSingleBy(PropertyEntity);

export const getPropertyFilesBy = getSingleBy(propertyFiles);

@EntityRepository(PropertyEntity)
export class propertyRepository extends Repository<PropertyEntity> {}

@EntityRepository(FloorDetail)
export class FloorRepository extends Repository<FloorDetail> {}

@EntityRepository(propertyFiles)
export class propertyFilesRepository extends Repository<propertyFiles> {}

@EntityRepository(PropertyComments)
export class propertyCommentRepository extends Repository<PropertyComments> {}
