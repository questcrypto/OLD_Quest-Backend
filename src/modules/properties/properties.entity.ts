import {
  IsBoolean,
  IsDecimal,
  IsNumber,
  isString,
  IsString,
} from 'class-validator';
import { CreatedModified } from '../../helper/helper';
import {
  Column,
  Entity,
  EntityRepository,
  EntitySchema,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  propertData,
  TypeofDocument,
  TypeOfProperty,
} from './properties.interface';

@Entity()
export class PropertyEntity extends CreatedModified implements propertData {
  @PrimaryColumn()
  id: string;

  @Column()
  NftCid: string;

  @Column()
  Fname: string;

  @Column()
  Lname: string;

  @Column()
  Email: string;

  @Column()
  PublicAddress: string;

  @Column()
  PropertyType: TypeOfProperty;

  @Column()
  PropertyName: string;

  @Column()
  CurrentValue: number;

  @Column()
  Comments: string;

  @Column()
  YearBuilt: Date;

  @Column()
  Zoning: string;

  @Column()
  Landscaping: string;

  @Column({ type: 'double precision' })
  Lotfacts: number;
  @Column()
  Address1: string;
  @Column()
  Address2: string;
  @Column()
  City: string;
  @Column()
  State: string;
  @Column()
  Subdivision: string;
  @Column()
  Country: string;
  @Column()
  PostalCode: number;
  @Column()
  SchoolDistrict: string;
  @Column()
  Elementary: string;
  @Column()
  JrHigh: string;
  @Column()
  HighSchool: string;
  @Column({ type: 'double precision' })
  Insurance: number;
  @Column({ type: 'double precision' })
  Maintenance: number;
  @Column({ type: 'double precision', default: 0 })
  Taxes: number;
  @Column({ type: 'double precision', default: 0 })
  Expenses: number;
  @Column()
  AC: string;
  @Column()
  Heating: string;
  @Column()
  Roof: string;
  @Column()
  Floor: string;
  @Column()
  WindowCovering: string;
  @Column()
  Pool: string;
  @Column()
  PoolFeature: string;
  @Column()
  Style: string;
  @Column()
  Deck: string;
  @Column()
  Patio: string;
  @Column()
  Garage: string;
  @Column()
  Carpot: string;
  @Column()
  ParkingSpace: number;
  @Column()
  FinBasmt: number;
  @Column()
  Basement: string;
  @Column()
  Driveway: string;
  @Column()
  Water: string;
  @Column()
  WaterShare: string;
  @Column()
  Spa: string;
  @Column()
  ApprovedByOwner: boolean;
  @Column({ nullable: true })
  ApprovedByHOA: boolean;
  @Column()
  Isactive: boolean;
}

@Entity()
export class FloorDetail extends CreatedModified {
  @PrimaryColumn()
  @IsString()
  id: string;

  @ManyToOne(
    () => PropertyEntity,
    (prop: PropertyEntity) => prop.id,
  )
  @IsString()
  propid: string;

  @Column()
  @IsNumber()
  SquareFoot: number;

  @Column()
  @IsNumber()
  Bedroom: number;

  @Column()
  @IsNumber()
  family: number;

  @Column()
  @IsNumber()
  kitchen: number;

  @Column()
  @IsNumber()
  Laundary: number;

  @Column({ type: 'double precision' })
  @IsDecimal()
  Bath: number;
}

@Entity()
export class propertyFiles extends CreatedModified {
  @PrimaryColumn()
  @IsString()
  id: string;

  @ManyToOne(
    () => PropertyEntity,
    (prop: PropertyEntity) => prop.id,
  )
  @IsString()
  propid: string;

  @Column()
  @IsString()
  Name: string;

  @Column()
  @IsString()
  Description: string;

  @Column({ nullable: true })
  @IsString()
  Tag: string;

  @Column()
  @IsNumber()
  type: TypeofDocument;

  @Column()
  @IsString()
  filename: string;
}

@Entity()
export class PropertyComments extends CreatedModified {
  @PrimaryColumn()
  @IsString()
  id: string;

  @ManyToOne(
    () => PropertyEntity,
    (prop: PropertyEntity) => prop.id,
  )
  @IsString()
  propid: string;

  @Column()
  @IsNumber()
  Field: number;

  @Column()
  @IsString()
  Remark: string;

  @Column()
  @IsString()
  CommentedBy: string;

  @Column()
  @IsBoolean()
  Isread: boolean;
}
