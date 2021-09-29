import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { emailDto, nonceDto, signatureDto, signUpResponse, userDto ,randomUserDTO,blockIpDTO} from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('Users')
export class UserController {
   constructor(public readonly userService: UserService) { }

   @Post('signUp')
   @HttpCode(HttpStatus.OK)
   @ApiOkResponse({ type: signUpResponse, description: 'SIGN UP NEW USER' })
   async signUp(@Body() userDto: userDto) {
      var res = await this.userService.signUp(userDto);
      if (res == 400) {
         return {
            ResponseStatus: res,
            Message: "This email is already in use"
         }
      }
      else {
         console.log(res);
         return {
            publicaddress: res.publicaddress,
            nonce: res.nonce
         }
      }
   }



   @Post('CreateAdmin')
   @HttpCode(HttpStatus.OK)
   @ApiOkResponse({ type: signUpResponse, description: 'SIGN UP NEW USER' })
   async signUpadmin(@Body() userDto: userDto) {
      var res = await this.userService.signupasadmin(userDto);
      if (res == 400) {
         return {
            ResponseStatus: res,
            Message: "This email is already in use"
         }
      }
      else {
         console.log(res);
         return {
            publicaddress: res.publicaddress,
            nonce: res.nonce
         }
      }
   }


   @Post('CreateTreasury')
   @HttpCode(HttpStatus.OK)
   @ApiOkResponse({ type: signUpResponse, description: 'SIGN UP NEW USER' })
   async signuptreasury(@Body() userDto: userDto) {
      var res = await this.userService.signupasTreasury(userDto);
      if (res == 400) {
         return {
            ResponseStatus: res,
            Message: "This email is already in use"
         }
      }
      else {
         return {
            publicaddress: res.publicaddress,
            nonce: res.nonce
         }
      }
   }

   @Post('updateNonce')
   @HttpCode(HttpStatus.OK)
   @ApiOkResponse({ type: signUpResponse, description: "Update nonce" })
   async updateNonce(@Body() nonceDto: nonceDto) {
      return await this.userService.updateNonce(nonceDto.publicaddress.toLowerCase())
   }

   @Get('GetNonce/:publicaddress')
   @HttpCode(HttpStatus.OK)
   @ApiOkResponse({ description: "Get Nonce of Address" })
   async getnonce(@Param('publicaddress') publicaddress: string) {
      const nonce = await this.userService.getNonce(publicaddress);
      return nonce
   }

   @Post('getAuth')
   @HttpCode(HttpStatus.OK)
   @ApiOkResponse({ description: "Get JWT token by Address and Signature" })
   async updateNone(@Body() signatureDto: signatureDto) {
      return await this.userService.auth(signatureDto);
   }

   @Post('/updaterole')
   @HttpCode(HttpStatus.OK)
   @ApiOkResponse({ description: "All published properties" })
   async getnullvalues(@Body() publicAddress: string) {
      return await this.userService.updateRole(publicAddress);
   }

   @Post('checkEmail')
   @HttpCode(HttpStatus.OK)
   @ApiOkResponse({ type: signUpResponse, description: 'CHECK EMAIL' })
   async checkEmail(@Body() emailDto: emailDto) {
      return await this.userService.checkEmail(emailDto);
   }


   // @Get('getPassCode/:email')
   // @HttpCode(HttpStatus.OK)
   // @ApiOkResponse({ description: "Get User PassCode" })
   // async getOtp(@Param('email') email: string) {
   //    return await this.userService.getOtp(email);
   // }

   @Post('randomUser')
   @HttpCode(HttpStatus.OK)
   @ApiOkResponse({ type: signUpResponse, description: 'CREATE RANDOM USER' })
   async createRuser(@Body() randomUserDTO: randomUserDTO) {
      return await this.userService.createRuser(randomUserDTO)
   }

   @Get('getRandomUser/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOkResponse({description:"GET RANDOM USER"})
   async getRuser(@Param('id') id:number){
      return await this.userService.getRuser(id)
   }


   @Post('blockIp')
   @HttpCode(HttpStatus.OK)
   @ApiOkResponse({description: 'CHECK IP FOR BLOCKED COUNTRY' })
   async blockIp(@Body() blockIpDTO:blockIpDTO) {
      return await this.userService.blockIp(blockIpDTO)
   }

   

}
