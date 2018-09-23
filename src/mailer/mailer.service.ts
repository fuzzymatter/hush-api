import { Injectable } from '@nestjs/common';
import { validate, IsEmail, Length, IsOptional } from 'class-validator';
import { ConfigService } from '../config/config.service';
import { SendGridMailer } from './sendgrid-mailer.service';

export class MessageData {
  @IsEmail()
  readonly to: string;

  @IsEmail()
  readonly from: string;

  @Length(10, 255)
  readonly subject: string;

  @Length(10)
  readonly text: string;

  @Length(10)
  @IsOptional()
  readonly html?: string;

  constructor(data: MessageData) {
    this.to = data.to;
    this.from = data.from;
    this.subject = data.subject;
    this.text = data.text;
    this.html = data.html;
  }
}

@Injectable()
export class MailerService {
  constructor(
    readonly configService: ConfigService,
    private readonly sendGridMailer: SendGridMailer,
  ) {
    this.sendGridMailer.setApiKey(configService.env.SENDGRID_API_KEY);
  }

  async send(messageData: MessageData) {
    await validate(new MessageData(messageData)).then(errors => {
      if (errors.length > 0) throw errors;
    });

    return this.sendGridMailer
      .send(messageData)
      .then(() => ({ success: true }))
      .catch(error => {
        const { message, code } = error;

        // TODO: Logging + Rollbar
        throw new Error('An error occurred sending email.');
      });
  }
}
