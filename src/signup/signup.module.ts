import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { SignupController } from './signup.controller';
import { MailerModule } from '../mailer/mailer.module';
import { SignupService } from './signup.service';
import { Signup } from './signup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Signup]), MailerModule],
  controllers: [SignupController],
  providers: [SignupService],
})
export class SignupsModule {}
