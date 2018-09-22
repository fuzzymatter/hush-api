import { Module } from '@nestjs/common';
import { VerifiedSignupController } from './verified-signup.controller';
import { SignupsModule } from '../signup/signup.module';

@Module({
  imports: [SignupsModule],
  controllers: [VerifiedSignupController],
})
export class VerifiedSignupModule {}
