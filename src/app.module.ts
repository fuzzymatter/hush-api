import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignupsModule } from './signup/signup.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { VerifiedSignupModule } from './verified-signup/verified-signup.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.env.TYPEORM_CONNECTION,
        host: configService.env.TYPEORM_HOST,
        port: configService.env.TYPEORM_PORT,
        username: configService.env.TYPEORM_USERNAME,
        password: configService.env.TYPEORM_PASSWORD,
        database: configService.env.TYPEORM_DATABASE,
        entities: configService.env.TYPEORM_ENTITIES,
        synchronize: configService.env.TYPEORM_SYNCHRONIZE,
      }),
      inject: [ConfigService],
    }),
    SignupsModule,
    MailerModule,
    VerifiedSignupModule,
  ],
})
export class AppModule {}
