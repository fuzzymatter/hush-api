import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { SignupsModule } from './signup/signup.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forRoot(), SignupsModule, MailerModule],
})
export class AppModule {}
