import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  isString,
  IsString,
} from 'class-validator';
import {
  Floordetail,
  propertyfiles,
  TypeOfProperty,
} from './properties.interface';

export class PublicAddressDto {
  @ApiProperty()
  @IsString()
  publicaddress: string;
}
export class propertyIdDto {
  @ApiProperty()
  @IsString()
  id: string;
}
export class FloorDetailDTO {
  @ApiProperty()
  @IsNumber()
  floor: string;

  @ApiProperty()
  @IsNumber()
  SquareFoot: number;

  @ApiProperty()
  @IsNumber()
  Bedroom: number;

  @ApiProperty()
  @IsNumber()
  family: number;

  @ApiProperty()
  @IsNumber()
  kitchen: number;

  @ApiProperty()
  @IsNumber()
  Laundary: number;

  @ApiProperty()
  @IsNumber()
  Bath: number;
}

export class UpdateFloorDetail extends FloorDetailDTO {
  @ApiProperty()
  id: string;
}

export class PropertyFilesDto {
  @ApiProperty()
  @IsString()
  Name: string;

  @ApiProperty()
  @IsString()
  Description: string;

  @ApiProperty()
  @IsString()
  OriginalName: string;
}

export class PropertyImageDto extends PropertyFilesDto {
  @ApiProperty()
  @IsString()
  Tag: string;
}

export class UpdateImageDetail extends PropertyImageDto {
  @ApiProperty()
  id: string;
}

export class PropertyComment {
  @ApiProperty()
  @IsString()
  propid: string;

  @ApiProperty()
  @IsNumber()
  Field: number;

  @ApiProperty()
  @IsString()
  Remark: string;

  @ApiProperty()
  @IsString()
  CommentedBy: string;
}

export class FetchCommentDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNumber()
  Field: number;

  @ApiProperty()
  @IsString()
  publicAddress: string;
}

export class FetchUnreadCommentDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNumber()
  publicAddress: string;
}

export class ApprovedbyOwner {
  @ApiProperty()
  @IsString()
  id: string;
}

export class basePropertyDTO {
  @ApiProperty()
  @IsString()
  Fname: string;

  @ApiProperty()
  @IsString()
  Lname: string;

  @ApiProperty()
  @IsEmail()
  Email: string;

  @ApiProperty()
  @IsString()
  PublicAddress: string;

  @ApiProperty()
  @IsEnum(TypeOfProperty)
  PropertyType: TypeOfProperty;

  @ApiProperty()
  @IsString()
  PropertyName: string;

  @ApiProperty()
  @IsNumber()
  CurrentValue: number;

  @ApiProperty()
  @IsString()
  Comments: string;

  @ApiProperty()
  @IsDate()
  YearBuilt: Date;

  @ApiProperty()
  @IsString()
  Zoning: string;

  @ApiProperty()
  @IsString()
  Landscaping: string;

  @ApiProperty()
  @IsNumber()
  Lotfacts: number;

  @ApiProperty()
  @IsString()
  Address1: string;

  @ApiProperty()
  @IsString()
  Address2: string;

  @ApiProperty()
  @IsString()
  City: string;

  @ApiProperty()
  @IsString()
  State: string;

  @ApiProperty()
  @IsString()
  Subdivision: string;

  @ApiProperty()
  @IsString()
  Country: string;

  @ApiProperty()
  @IsNumber()
  PostalCode: number;

  @ApiProperty()
  @IsNumber()
  SchoolDistrict: string;

  @ApiProperty()
  @IsString()
  Elementary: string;

  @ApiProperty()
  @IsString()
  JrHigh: string;

  @ApiProperty()
  @IsString()
  HighSchool: string;

  @ApiProperty()
  @IsNumber()
  Insurance: number;

  @ApiProperty()
  @IsNumber()
  Maintenance: number;

  @ApiProperty()
  @IsNumber()
  Taxes: number;

  @ApiProperty()
  @IsNumber()
  Expenses: number;

  @ApiProperty()
  @IsString()
  AC: string;

  @ApiProperty()
  @IsString()
  Heating: string;

  @ApiProperty()
  @IsString()
  Roof: string;

  @ApiProperty()
  @IsString()
  Floor: string;

  @ApiProperty()
  @IsString()
  WindowCovering: string;

  @ApiProperty()
  @IsString()
  Pool: string;

  @ApiProperty()
  @IsString()
  PoolFeature: string;

  @ApiProperty()
  @IsString()
  Style: string;

  @ApiProperty()
  @IsNumber()
  Deck: string;

  @ApiProperty()
  @IsString()
  Patio: string;

  @ApiProperty()
  @IsNumber()
  Garage: string;

  @ApiProperty()
  @IsString()
  Carpot: string;

  @ApiProperty()
  @IsNumber()
  ParkingSpace: number;

  @ApiProperty()
  @IsNumber()
  FinBasmt: number;

  @ApiProperty()
  @IsString()
  Basement: string;

  @ApiProperty()
  @IsString()
  Driveway: string;

  @ApiProperty()
  @IsString()
  Water: string;

  @ApiProperty()
  @IsString()
  WaterShare: string;

  @ApiProperty()
  @IsNumber()
  Spa: string;
}

export class propertyDto extends basePropertyDTO {
  @ApiProperty({ type: [FloorDetailDTO] })
  @IsArray()
  FloorDetails: Floordetail[];

  @ApiProperty({ type: [PropertyImageDto] })
  PropertyImages: propertyfiles[];

  @ApiProperty({ type: [PropertyFilesDto] })
  PropertyDocs: propertyfiles[];
}

export class propertyUpdateDto extends basePropertyDTO {
  @ApiProperty()
  @IsNumber()
  id: string;

  @ApiProperty({ type: [UpdateFloorDetail] })
  @IsArray()
  FloorDetails: Floordetail[];
}

export class propertyImageUpdateDto {
  @ApiProperty()
  @IsNumber()
  id: string;

  @ApiProperty({ type: [UpdateImageDetail] })
  @IsArray()
  ImageDetail: propertyfiles[];
}

export class onboardingCountDTO {
  @ApiProperty()
  @IsString()
  publicAdddress: string;
}

export class onboradingCountResponse {
  @ApiProperty()
  @IsNumber()
  totalProperty: string;

  @ApiProperty()
  @IsNumber()
  dueToOnboard: string;
}
