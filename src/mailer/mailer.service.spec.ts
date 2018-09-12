import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigModule } from '../config/config.module';
import { SendGridMailer } from './sendgrid-mailer.service';

describe('MailerService', () => {
  let service: MailerService;
  const mailerMock = {
    async send() {
      return 0;
    },

    setApiKey() {},
  };

  beforeAll(async () => {
    const SendGridMailerProvider: Provider = {
      provide: SendGridMailer,
      useValue: mailerMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [MailerService, SendGridMailerProvider],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should call SendGridMailer.send()', async () => {
    jest.spyOn(mailerMock, 'send').mockImplementation(async () => [1, 2]);

    expect(
      await service.send({ to: '', from: '', subject: '', text: '', html: '' }),
    ).toBe(true);

    expect(mailerMock.send).toHaveBeenCalledTimes(1);
  });
});
