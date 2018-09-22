import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignupController } from './signup.controller';
import { MailerModule } from '../mailer/mailer.module';
import { SignupService } from './signup.service';
import { Signup } from './signup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Signup]), MailerModule],
  controllers: [SignupController],
  providers: [SignupService],
  exports: [SignupService],
})
export class SignupsModule {}
