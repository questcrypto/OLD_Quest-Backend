import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { signUpResponse, userDetailDTO } from '../user/user.dto';
import {
  ApprovedbyOwner,
  FetchCommentDto,
  FetchUnreadCommentDto,
  propertyIdDto,
  PropertyComment,
  propertyDto,
  propertyUpdateDto,
  PublicAddressDto,
  onboradingCountResponse,
  PropertyFilesDto,
  PropertyImageDto,
  propertyImageUpdateDto,
} from './properties.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PropertiesService } from './properties.service';
import {
  ApproveByOwner,
  onboardingCountIF,
  propertyfiles,
} from './properties.interface';
import {
  Auth,
  GetHOAadminId,
  GetUserDetail,
  GetUserId,
} from '../auth/auth.guard';

@Controller('properties')
// @UseGuards(AuthGuard())
@ApiTags('Properties')
export class PropertiesController {
  constructor(public readonly propertyService: PropertiesService) {}

  // @UseGuards(AuthGuard())
  @Get()
  async sayhello() {
    return 'hello';
  }

  @Get('/GetPublishedPropertyOwner/:publicaddress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'My Published properties' })
  async getpublishedpropertyOwner(
    @Param('publicaddress') publicaddress: string,
  ) {
    return await this.propertyService.GetPublishedPropertiesForOwner(
      publicaddress,
    );
  }

  @Get('/GetAllPublishedProperties')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get All Published properties' })
  async GetAllPublishedProperty() {
    return await this.propertyService.GetAllPublishedProperties();
  }

  @Post('/addProperty')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: signUpResponse, description: 'Add new Property' })
  async registerNewProperty(@Body() propertyDetail: propertyDto) {
    console.log(propertyDetail);
    return {
      Message: 'sss',
      ResponseStatus: 200,
    };
  }

  options = {
    storage: diskStorage({
      destination: '../../../upload',
      filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  };

  @Post('/Addproperties')
  @UseInterceptors(
    FilesInterceptor('file', 20, {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files, @Body() body: propertyDto) {
    const response = [];
    files.forEach(file => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    let res = await this.propertyService.Addproperty(response, body);
    return res;
  }

  @Get('/GetProperty/:publicaddress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get property details' })
  async getproperty(@Param('publicaddress') publicaddress: string) {
    console.log(publicaddress);
    return await this.propertyService.GetAllPropertyByPublicAddress(
      publicaddress,
    );
  }

  @Get('GetAllProperty')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get All Property' })
  async getallproperty() {
    return this.propertyService.GetAllProperty();
  }

  @Get('GetpublishedProperty/:publicaddress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get All Property' })
  async getpublishedpropertydetail() {
    return this.propertyService.GetAllProperty();
  }

  @Get('/GetSingleProperty/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get property details' })
  async getSingleproperty(@Param('id') id: string) {
    return await this.propertyService.GetPropertyByID(id);
  }

  @Post('/AddComment')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Add Comment' })
  async addComment(@Body() body: PropertyComment) {
    return await this.propertyService.AddComment(body);
  }

  @Post('/UpdateProperty')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({ description: 'Update Property Details' })
  async updatePropertyDetail(
    @GetHOAadminId() user: string,
    @Body() body: propertyUpdateDto,
  ) {
    return await this.propertyService.UpdateProperties(body);
  }

  @Post('/UpdatePropertyImage')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @UseInterceptors(
    FilesInterceptor('file', 20, {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiOkResponse({ description: 'Update Property Image' })
  async updatePropertyImage(
    @GetHOAadminId() user: string,
    @UploadedFile() file,
    @Body() body: propertyImageUpdateDto,
  ) {
    const response = [];
    file.forEach(file => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return await this.propertyService.UpdatePropertyImage(response, body);
  }

  @Post('/getCommentById')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get Comments by property Field' })
  async getCommentById(@Body() body: FetchCommentDto) {
    return await this.propertyService.fetchCommentByID(body);
  }

  @Post('/getUnreadComment')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.BAD_REQUEST)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'Get unread comment' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNoContentResponse({ description: 'No data found' })
  async fetchUnreadComment(@Body() body: FetchUnreadCommentDto) {
    console.log(body);
    return await this.propertyService.fetchUnreadComment(body);
  }

  @Post('/ApproveByPropertyOwner')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Property Approved by PropertyOwner' })
  async approveByPropertyOwner(@Body() body: ApprovedbyOwner) {
    return await this.propertyService.ApproveByOwner(body);
  }

  @Post('/ApproveByHOAAdmin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Property Get Published by HOA Admin' })
  async approveByHOAAdmin(@Body() body: ApprovedbyOwner) {
    return await this.propertyService.ApproveByHOAAdmin(body);
  }

  @Get('/GetApprovedPropertyHOA')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'All properties Approved by PropertyOwners' })
  async getapprovedpropertyHOA() {
    return await this.propertyService.GetApprovedPropertiesForHOAAdmin();
  }

  @Get('/GetApprovedPropertyOwner/:publicaddress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'My own approved properties' })
  async getapprovedproperty(@Param('publicaddress') publicaddress: string) {
    return await this.propertyService.GetApprovedPropertiesByOwner(
      publicaddress,
    );
  }

  @Get('/GetPublishedProperty')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'All published properties' })
  async getpublishedproperty() {
    return await this.propertyService.GetPublishedPropertiesForAdmin();
  }

  @Get('/Getallproperties')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'All published properties' })
  async getallproperties() {
    return await this.propertyService.GetAllProperties();
  }

  @Get('/updateValues')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'All published properties' })
  async getnullvalues() {
    return await this.propertyService.Updatevalue();
  }

  @Post('/getword')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'All published properties' })
  async getlength(@Body() body: ApprovedbyOwner) {
    return await this.propertyService.getwords(body);
  }

  @Post('/getStatus')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'All published properties' })
  async getStatus(@Body() body: PublicAddressDto) {
    try {
      return await this.propertyService.checkTxInitiatedByOtherIsCompletedOrNot(
        body.publicaddress,
      );
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  @Post('/getPendingTransaction')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'All published properties' })
  async getPendingTransaction(@Body() body: PublicAddressDto) {
    try {
      const mapping = [];
      let pendingtransaction = await this.propertyService.getPendingTransactions(
        body.publicaddress,
      );
      for (let i = 0; i < pendingtransaction.length; i++) {
        let transaction = await this.propertyService.getTransactionDetails(
          body.publicaddress,
          pendingtransaction[i],
        );
        let obj = {
          PropertyID: transaction.propertyID,
          TransactionID: pendingtransaction[i],
        };
        mapping.push(obj);
      }
      const pendingForSignature = await this.propertyService.checkTxInitiatedByOtherIsCompletedOrNot(
        body.publicaddress,
      );
      return mapping;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  // This gives back all the pending transactions of the platform
  @Post('/getAllPendingTransaction')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'All published properties' })
  async getAllPendingTransaction(@Body() body: PublicAddressDto) {
    try {
      return await this.propertyService.GetTransactionsToBeSigned(
        body.publicaddress,
      );
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  @Post('/updatePropertyStatus')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Update property is minted' })
  async updatepropertystatus(@Body() body: propertyIdDto) {
    try {
      return await this.propertyService.updateIsactive(body.id);
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  @Get('/getOnboardCount')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get count of property to be onboarded' })
  @ApiBearerAuth()
  @Auth()
  async getOnBoradCount(@GetUserDetail() user: userDetailDTO): Promise<any> {
    let input: onboardingCountIF = {
      publicaddress: user.publicaddress,
      role: user.role,
    };
    const result = await this.propertyService.getOnboardingDetails(input);
    return result;
  }
}
