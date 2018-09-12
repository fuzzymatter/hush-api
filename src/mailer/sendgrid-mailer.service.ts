import { Injectable } from '@nestjs/common';
import SendGrid from '@sendgrid/mail';
import { SendMailSettings } from './mailer.service';

@Injectable()
export class SendGridMailer {
  send(mailSettings: SendMailSettings) {
    return SendGrid.send(mailSettings);
  }

  setApiKey(key: string): void {
    SendGrid.setApiKey(key);
  }
}
