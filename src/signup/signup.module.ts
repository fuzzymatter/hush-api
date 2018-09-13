import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { MailerModule } from '../mailer/mailer.module';
import { SignupService } from './signup.service';

@Module({
  controllers: [SignupController],
  providers: [SignupService],
  imports: [MailerModule],
})
export class SignupsModule {}
