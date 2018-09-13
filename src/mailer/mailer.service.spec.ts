import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { Chance } from 'chance';
import { MailerService, MessageData } from './mailer.service';
import { ConfigModule } from '../config/config.module';
import { SendGridMailer } from './sendgrid-mailer.service';
import { Response } from 'request';
import { ResponseError } from '@sendgrid/helpers/classes';
import { ValidationError } from 'class-validator';

const chance = new Chance();

const messageDataFactory = (): MessageData => ({
  to: chance.email(),
  from: chance.email(),
  subject: chance.sentence(),
  text: chance.paragraph(),
});

describe('MailerService', () => {
  let service: MailerService;

  const sendGridMock = {
    async send(messageData: MessageData): Promise<[Response, {}]> {
      return [{ statusCode: 202 } as Response, undefined];
    },

    setApiKey(key: string) {},
  };

  beforeAll(async () => {
    const SendGridMailerProvider: Provider = {
      provide: SendGridMailer,
      useValue: sendGridMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [MailerService, SendGridMailerProvider],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should call SendGridMailer.send() once', async () => {
    jest.spyOn(sendGridMock, 'send');

    await expect(service.send(messageDataFactory())).resolves.toEqual({
      success: true,
    });

    expect(sendGridMock.send).toHaveBeenCalledTimes(1);
  });

  it('should fail with [ValidationError] if message data is not valid', async () => {
    jest.spyOn(sendGridMock, 'send');

    const errors: [ValidationError] = await service
      .send({ to: '', from: '', subject: '', text: '' })
      .catch(error => error);

    errors.map(error => expect(error).toBeInstanceOf(ValidationError));

    expect(sendGridMock.send).toHaveBeenCalledTimes(0);
  });

  it('should throw error if SendGridMailer.send() fails', async () => {
    jest.spyOn(sendGridMock, 'send').mockImplementation(() =>
      Promise.reject({
        code: 400,
        message: 'Error sending email.',
      } as ResponseError),
    );

    await expect(service.send(messageDataFactory())).rejects.toThrow();

    expect(sendGridMock.send).toHaveBeenCalledTimes(1);
  });
});
