export interface AuctionDetails{
    id:string,
    propid:string,
    startDate:Date,
    endDate:Date,
    minReserve:number,
    slReserve:number,
    suggestedLowestBid:number,
    memo:string,
    isApprovedByOwner:boolean,
    isIssuedBy:string,
    isActive:boolean,
    status:BidStatus
}

export interface ConfigureAuctionIF{
    propid:string,
    startDate:Date,
    endDate:Date,
    minReserve:number,
    slReserve:number,
    suggestedLowestBid:number,
    memo:string,
    isIssuedBy:string
}

export interface OwnersActionIF{
    id:string,
    Comment:string,
    isApprovedByOwner:boolean

}

export interface ActivateAuctionIF{
    id:string
}

export interface bidEligibilityIF{
    bidPrice:number,
    totalQuantity:number,
    id:string
}

export enum BidStatus{

    Pending=1,
    Ongoing=2,
    Completed=3,
    Failed=4,
    Rejected=5

}

export interface makeBidIF{
    auctionID:string
    biddersID:string
    bidPrice:number
    totalAmount:number
    propertyID:string
    initialAllotedTokens:number
    contactNumber ?:number
}