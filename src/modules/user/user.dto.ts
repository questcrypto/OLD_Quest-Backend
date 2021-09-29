import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, isUUID } from 'class-validator';
import { isUuid } from 'uuidv4';
import { MessageResponse, Role } from './user.interface';



export class userDto{

    @ApiProperty()
    @IsEmail()
    email:string

    @ApiProperty()
    @IsString()
    publicaddress:string

    @ApiProperty()
    @IsString()
    name:string

    @ApiProperty()
    @IsNumber()
    otp:number

}

export class emailDto{
    @ApiProperty()
    @IsEmail()
    email:string

    @ApiProperty()
    @IsString()
    name:string

}

export class signUpResponse{
     @ApiProperty()
     @IsNumber()
     ResponseStatus:MessageResponse
    
     @ApiProperty()
     @IsString()
     Message:string
}

export class nonceDto{
    @ApiProperty()
    @IsString()
    publicaddress:string
}

export class signatureDto{
   
    @ApiProperty()
    @IsString()
    publicaddress:string

    @ApiProperty()
    @IsString()
    signature:string

}

export class userDetailDTO{
    @ApiProperty()
    @IsString()
    id:string

    @ApiProperty()
    @IsString()
    publicaddress:string

    @ApiProperty()
    @IsString()
    email:string

    @ApiProperty()
    @IsNumber()
    role:Role

    @ApiProperty()
    @IsNumber()
    iat:number

    @ApiProperty()
    @IsNumber()
    exp:number

}

export class randomUserDTO{
    
    @ApiProperty()
    @IsString()
    email:string

    @ApiProperty()
    @IsString()
    userName:string

    @ApiProperty()
    @IsString()
    mobile:string

    @ApiProperty()
    @IsString()
    skypeId:string

    @ApiProperty()
    @IsString()
    telegramId:string

    @ApiProperty()
    @IsString()
    message:string
    
}

export class blockIpDTO{
    @ApiProperty()
    @IsString()
    ip:string
}

export class authDto{
    @ApiProperty()
    @IsOptional()
    @IsString()
    token:string
}