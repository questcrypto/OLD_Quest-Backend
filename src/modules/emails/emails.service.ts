import { BadRequestException, Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { v4 } from 'uuid';
import { NotificationRepository } from './notification.repository';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { Notification } from './notification.interface';
import { getClientBy } from '../websocket/websocket.repository';
import { GetNotificationsResponse } from '../emails/notification.response';
import { getNotificationsByRequest } from '../emails/notification.repository';

@Injectable()
export class EmailsService {
  constructor(
    public readonly notificationRepository: NotificationRepository,
    public readonly gateway: WebsocketGateway,
  ) {}

  async sendEmail(email, Subject, context, templateName) {
    const filePath = path.join(__dirname, `/templates/${templateName}`);
    const source = fs.readFileSync(filePath, 'utf8');
    let template = Handlebars.compile(source);

    sgMail.setApiKey(
      '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',
    );
    const msg = {
      to: email, // Change to your recipient
      from: 'susmita@rapidinnovation.dev', // Change to your verified sender
      subject: Subject,
      html: template(context),
    };

    await sgMail.send(msg);
    return { status: 200, message: 'Email sent' };
  }

  async notifications(to, message, type) {
    try {
      const id = v4();
      const obj: Notification = {
        id,
        receiver: to,
        message,
        type,
      };

      await this.notificationRepository.insert(obj);
      const client = await getClientBy({ user: to });

      if (client)
        await this.gateway.wss
          .to(client.clientId)
          .emit('notification', { data: obj });
      return obj;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getNotifications(userId: string): Promise<GetNotificationsResponse[]> {
    try {
      const notifications = await getNotificationsByRequest(userId);
      return notifications;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
