import { Module } from '@nestjs/common';
import { SignupsController } from './signups.controller';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  controllers: [SignupsController],
  imports: [MailerModule],
})
export class SignupsModule {}
