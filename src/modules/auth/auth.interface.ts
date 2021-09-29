import { ApiProperty } from "@nestjs/swagger";

export class TokenResponse {
    @ApiProperty()
    token: string
  }


  export interface JwtPayload {
    publicaddress: string
    email: string
    role: number
    id:string
  }