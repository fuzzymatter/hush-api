import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { SignupsController } from './signups.controller';
import { SendMailSettings } from '../mailer/mailer.service';

describe('Signups Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    const MailerServiceProvider: Provider = {
      provide: 'MailerService',
      useValue: {
        async send(mailSettings: SendMailSettings) {},
      },
    };

    module = await Test.createTestingModule({
      controllers: [SignupsController],
      providers: [MailerServiceProvider],
    }).compile();
  });

  it('should be defined', () => {
    const controller: SignupsController = module.get<SignupsController>(
      SignupsController,
    );

    expect(controller).toBeDefined();
  });
});
