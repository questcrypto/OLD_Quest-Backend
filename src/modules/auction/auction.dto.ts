import { ApiOkResponse, ApiProperty } from "@nestjs/swagger"
import { IsBoolean, isBoolean, IsDate, IsNumber, IsString } from "class-validator"


export class configureAuctionDto{
    @ApiProperty()
    @IsString()
    propid:string

    @ApiProperty()
    @IsDate()
    startDate:Date

    @ApiProperty()
    @IsDate()
    endDate:Date

    @ApiProperty()
    @IsNumber()
    minReserve:number

    @ApiProperty()
    @IsNumber()
    slReserve:number

    @ApiProperty()
    @IsNumber()
    suggestedLowestBid:number

    @ApiProperty()
    @IsString()
    memo:string

    @ApiProperty()
    @IsString()
    ownersComment:string

    @ApiProperty()
    @IsString()
    isIssuedBy:string
}


export class ownersActionDto{
    @ApiProperty()
    @IsString()
    id:string

    @ApiProperty()
    @IsString()
    Comment:string

    @ApiProperty()
    @IsBoolean()
    isApprovedByOwner:boolean
}

export class bidEligibilityDTO{
    @ApiProperty()
    @IsNumber()
    bidPrice:number

    @ApiProperty()
    @IsNumber()
    totalQuantity:number

    @ApiProperty()
    @IsString()
    id:string
}

export class activateAuctionDTO{
    @ApiProperty()
    @IsString()
    id:string
}

export class makeBidDTO{

    @ApiProperty()
    @IsString()
    auctionID:string

    @ApiProperty()
    @IsString()
    biddersID:string

    @ApiProperty()
    @IsNumber()
    bidPrice:number

    @ApiProperty()
    @IsNumber()
    totalAmount:number

    @ApiProperty()
    @IsString()
    propertyID:string

    @ApiProperty()
    @IsNumber()
    initialAllotedTokens:number

    @ApiProperty({nullable:true})
    @IsNumber()
    contactNumber:number
}


export class myBidDTO{
    @ApiProperty()
    @IsString()
    id:string

    @ApiProperty()
    @IsString()
    publicaddress:string
}

export class endAuctionDTO{
    @ApiProperty()
    @IsString()
    auctionID:string

    @ApiProperty()
    @IsBoolean()
    auctionStatus:boolean
}