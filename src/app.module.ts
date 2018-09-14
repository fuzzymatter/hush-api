import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignupsModule } from './signup/signup.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('TYPEORM_HOST'),
        port: parseInt(configService.get('TYPEORM_PORT'), 10),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        database: configService.get('TYPEORM_DATABASE'),
        entities: [configService.get('TYPEORM_ENTITIES')],
        synchronize: Boolean(configService.get('TYPEORM_SYNCHRONIZE')),
      }),
      inject: [ConfigService],
    }),
    SignupsModule,
    MailerModule,
  ],
})
export class AppModule {}
