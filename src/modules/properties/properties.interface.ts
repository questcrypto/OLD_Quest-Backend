export enum TypeOfProperty {
  SingleFamilyResidence = 1,
  MultiFamilyResidence = 2,
  DevelopingLand = 3,
  Commercial = 4,
  RawLand = 5,
}

export enum TypeofDocument {
  Images,
  Documents,
}

export class IFetchUnreadComment {
  id: string;
  publicAddress: string;
}

export interface propertData {
  id: string;
  Fname: string;
  Lname: string;
  Email: string;
  PublicAddress: string;
  PropertyType: TypeOfProperty;
  PropertyName: string;
  CurrentValue: number;
  Comments: string;
  YearBuilt: Date;
  Zoning: string;
  Landscaping: string;
  Lotfacts: number;
  Address1: string;
  Address2: string;
  City: string;
  Subdivision: string;
  Country: string;
  State: string;
  PostalCode: number;
  SchoolDistrict: string;
  Elementary: string;
  JrHigh: string;
  HighSchool: string;
  Insurance: number;
  Maintenance: number;
  Taxes: number;
  Expenses: number;
  AC: string;
  Heating: string;
  Roof: string;
  Floor: string;
  WindowCovering: string;
  Pool: string;
  PoolFeature: string;
  Style: string;
  Deck: string;
  Patio: string;
  Garage: string;
  Carpot: string;
  ParkingSpace: number;
  FinBasmt: number;
  Basement: string;
  Driveway: string;
  Water: string;
  WaterShare: string;
  Spa: string;
}

export interface Floordetail {
  id: string;
  floor: string;
  propid: string;
  SquareFoot: number;
  Bedroom: number;
  family: number;
  kitchen: number;
  Laundary: number;
  Bath: Number;
}

export interface propertyfiles {
  id: string;
  propid: string;
  Name: string;
  Description: string;
  Tag: string;
  type: string;
  Filename: string;
}

export enum MessageResponse {
  Successfull = 'Successfull',
  Error = 400,
}

export interface publicAddress {
  publicAddress: string;
}

export class onboradingCountResponseIF {
  totalProperty: string;
  dueToOnboard: string;
}

export class onboardingCountIF {
  publicaddress: string;
  role: number;
}

export interface propertyComment {
  id: string;
  propid: string;
  Field: string;
  Remark: string;
  CommentedBy: string;
}

export interface ApproveByOwner {
  id: string;
}

export enum propertyCommentKey {
  FNAME = 1,
  LNAME = 2,
  EMAIL = 3,
  PUBLICADRESS = 4,
  PROPERTYTYPE = 5,
  PROPERTYNAME = 6,
  CURRENTVALUE = 7,
  YEARBUILT = 8,
  ZONING = 9,
  LANDSCAPING = 10,
  LOTFACTS = 11,
  ADDRESS1 = 12,
  ADDRESS2 = 13,
  CITY = 14,
  SUBDIVSION = 15,
  COUNTRY = 16,
  STATE = 17,
  POSTALCODE = 18,
  SCHOOLDISTRICT = 19,
  ELEMENTARY = 20,
  JRHIGH = 21,
  HIGHSCHOOL = 22,
  INSURANCE = 23,
  MAINTENANCE = 24,
  Taxes = 25,
  Expenses = 26,
  AC = 27,
  HEATING = 28,
  ROOF = 29,
  FLOOR = 30,
  WINDOWCOVERING = 31,
  POOL = 32,
  POOLFEATURE = 33,
  STYLE = 34,
  DECK = 35,
  PATION = 36,
  GARAGE = 37,
  CARPOT = 38,
  PARKIGNSPACE = 39,
  FINBASMNT = 40,
  BASEMENT = 41,
  DRIVEWAY = 42,
  WATER = 43,
  WATERSHARE = 44,
  SPA = 45,
  IMAGES = 46,
}
