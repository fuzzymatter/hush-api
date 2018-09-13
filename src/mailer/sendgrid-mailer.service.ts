import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { MailData } from '@sendgrid/helpers/classes/mail';

@Injectable()
export class SendGridMailer {
  send(data: MailData) {
    return SendGrid.send(data);
  }

  setApiKey(key: string): void {
    SendGrid.setApiKey(key);
  }
}
