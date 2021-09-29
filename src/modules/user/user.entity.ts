import { CreatedModified } from "../../helper/helper";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ForeignKeyMetadata } from "typeorm/metadata/ForeignKeyMetadata";
import { UserData, IuserNonce, UserPassCode ,RandomUser} from "./user.interface";



@Entity()
export class userEntity extends CreatedModified implements UserData {
    @Column({ nullable: false })
    id: string

    @Column()
    email: string

    // @OneToMany(() => userNonce,(nonce:userNonce)=> nonce.nonce)
    @PrimaryColumn()
    publicaddress: string

    @Column()
    role: number

    @Column({ default: true })
    isActive: boolean

    @Column({ nullable: true, default: null })
    name: string

    @Column({ nullable: true, default: null })
    contactNumber: number

    @Column({nullable:true,default:null})
    passCode: number

}

// This the entity for the storing the nonce

@Entity()
export class userNonce extends CreatedModified implements IuserNonce {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    nonce: string

    @ManyToOne(() => userEntity, (user: userEntity) => user.publicaddress)
    @JoinColumn()
    publicaddress: string

}

@Entity()
export class userOtp extends CreatedModified implements UserPassCode {

    @PrimaryColumn()
    email: string

    @Column({nullable:true,default:null})
    passCode: number
}

@Entity()
export class randomUser extends CreatedModified implements RandomUser {
    @PrimaryGeneratedColumn()
    id:string

    @Column({nullable: false,default:null})
    email:string

    @Column({nullable: false,default:null})
    userName:string

    @Column({nullable:false,default:null})
    mobile:string

    @Column({nullable:true,default:null})
    skypeId:string

    @Column({nullable:true,default:null})
    telegramId:string

    @Column({nullable:true,default:null})
    message:string

}