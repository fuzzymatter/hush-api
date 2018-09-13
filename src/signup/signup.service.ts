import { Injectable } from '@nestjs/common';
import * as cuid from 'cuid';
import * as shortid from 'shortid';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class SignupService {
  constructor(private readonly mailer: MailerService) {}

  async create(email: string, name: string) {
    const text = `Hello ${name},\n\nHere is your signup verification code: ${shortid()}.`;
    const html = `Hello ${name},\n\nHere is your signup verification code: <strong>${shortid()}</strong>.`;

    await this.mailer.send({
      to: email,
      from: 'no-reply@hushdomain.com',
      subject: 'Your Hush Signup Code',
      text,
      html,
    });

    return { id: cuid() };
  }
}
