import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendGridMailer } from './sendgrid-mailer.service';

@Module({
  providers: [MailerService, SendGridMailer],
  exports: [MailerService],
})
export class MailerModule {}
