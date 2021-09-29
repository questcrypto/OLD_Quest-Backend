export enum MessageResponse{
    Successfull = "Data Stored ",
    Error = 400
}


export interface UserData{
    id:string,
    email:string,
    publicaddress:string,
    name ?:string,
    role:number,
    passCode:number,
} 

export enum Role{
    HOAAdmin = 1,
    General = 2,
    Treasury = 3
}

export interface IuserNonce{
    id:string,
    publicaddress:string,
    nonce:string
}

export interface UserPassCode{
    email:string,
    passCode:number,
}

export interface RandomUser{
    id:string
    email:string,
    userName:string,
    mobile:string
    skypeId ?:string,
    telegramId ?:string,
    message?:string
}