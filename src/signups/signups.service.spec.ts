import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignupsService } from './signups.service';
import { SendMailSettings } from '../mailer/mailer.service';
import { MailerModule } from '../mailer/mailer.module';

describe('SignupsService', () => {
  let service: SignupsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignupsService],
    }).compile();

    service = module.get<SignupsService>(SignupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
