import { Controller, Get, Param, Res } from '@nestjs/common';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: join(__dirname, 'upload') });
  }

  // @Get(':imagename')
  // getImage(@Param('imagename') image, @Res() res) {
  //   const response = res.sendFile(image, { root: './upload' });
  //   return {
  //     status: HttpStatus.OK,
  //     data: response,
  //   };
  // }
}
