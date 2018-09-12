import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { SendGridMailer } from './sendgrid-mailer.service';

export interface SendMailSettings {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class MailerService {
  constructor(
    readonly configService: ConfigService,
    private readonly mailer: SendGridMailer,
  ) {
    this.mailer.setApiKey(configService.get('SENDGRID_API_KEY'));
  }

  async send(messageSettings: SendMailSettings) {
    await this.mailer.send(messageSettings);

    return true;
  }
}
