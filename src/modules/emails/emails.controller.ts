import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EmailsService } from '../emails/emails.service';
import { GetNotificationsResponse } from '../emails/notification.response';
import { Auth, GetUserId } from '../auth/auth.guard';

@Controller('emails')
@ApiTags('Emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('/sendEmails')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'MAIL SENT SUCCESSFULLY' })
  async sendEmail(
    @Body() email: string,
    subject: string,
    name: string,
    templateName: string,
  ) {
    return await this.emailsService.sendEmail(
      email,
      subject,
      name,
      templateName,
    );
  }

  @Get('getNotication')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [GetNotificationsResponse],
    description: 'Get Notifications',
  })
  @ApiBearerAuth()
  @Auth()
  async getNotifications(@GetUserId() userId: string) {
    return await this.emailsService.getNotifications(userId);
  }
}
