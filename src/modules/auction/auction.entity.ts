import { CreatedModified } from "../../helper/helper";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { PropertyEntity } from "../properties/properties.entity";
import { AuctionDetails, BidStatus } from "./auction.interface";

@Entity()
export class AuctionEntity extends CreatedModified implements AuctionDetails{
    @PrimaryColumn()
    id:string

    @ManyToOne(() => PropertyEntity,(prop:PropertyEntity) => prop.id)
    propid:string

    @Column()
    startDate:Date

    @Column()
    endDate:Date

    @Column()
    minReserve:number

    @Column()
    slReserve:number

    @Column()
    suggestedLowestBid:number

    @Column()
    memo:string

    @Column()
    isApprovedByOwner:boolean

    @Column()
    isIssuedBy:string

    @Column()
    isActive:boolean

    @Column()
    status:BidStatus

    @Column({nullable:true})
    ownersComments:string

    @Column()
    isRead:boolean

}

@Entity()
export class AuctionBidDetails extends CreatedModified{
    @PrimaryColumn()
    id:string

    @PrimaryColumn()
    biddersPublicAddress:string

    @PrimaryColumn()
    @ManyToOne(()=>AuctionEntity,(auction:AuctionEntity) => auction.id)
    auctionID:string


    @Column()
    totalQty:number

    @Column({ type: 'double precision' })
    bidPrice:number

    @Column({ type: 'double precision' })
    totalAmountPaid:number

    @Column()
    propertyID:string

    @Column({ type: 'double precision' })
    initialAllotedTokens:number

    @Column({ type: 'double precision' })
    currentAllotment:number

    @Column()
    deficit:boolean

    @Column()
    bidStatus:BidStatus

    @Column({ type: 'double precision' })
    deposit:number
}



