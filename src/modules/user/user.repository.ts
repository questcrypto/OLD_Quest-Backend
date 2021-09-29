import { BadRequestException } from '@nestjs/common';
import { getSingleBy } from "../../helper/helper";
import {EntityRepository,Repository, getConnection} from 'typeorm';
import { userEntity, userNonce,userOtp ,randomUser} from './user.entity';
// import {} from 


export const getUserBy = getSingleBy(userEntity);
export const getUserNonce = getSingleBy(userNonce);

export const getUserNonceBy = getSingleBy(userNonce);

export async function updateContactNumber(contactNumber:number, publicaddress:string){
    try{
        const sql = `UPDATE user_entity SET "contactNumber"= $1 where "user_entity"."publicaddress"= $2`;
        const result = await getConnection().query(sql,[contactNumber,publicaddress]);
        return result;
    }
    catch(err){
        return new BadRequestException(err.message);
    }
}

@EntityRepository(userEntity)
export class UserRepository extends Repository<userEntity>{}

@EntityRepository(userNonce)
export class userNonceRepository extends Repository<userNonce>{}

@EntityRepository(userOtp)
export class userPassCodeRepository extends Repository<userOtp> {}

@EntityRepository(randomUser)
export class randomUserRepository extends Repository<randomUser>{}


