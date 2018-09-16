import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Chance } from 'chance';
import { SignupService } from './signup.service';
import { MailerService, MessageData } from '../mailer/mailer.service';
import { Signup, Status } from './signup.entity';

const chance = new Chance();

describe('SignupService', () => {
  let service: SignupService;

  const mailerMock = {
    async send(messageData: MessageData) {
      return { success: true };
    },
  };

  const signupRepositoryMock = {
    async save(signup: Signup) {},
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignupService,
        {
          provide: getRepositoryToken(Signup),
          useValue: signupRepositoryMock,
        },
        {
          provide: MailerService,
          useValue: mailerMock,
        },
      ],
    }).compile();

    service = module.get<SignupService>(SignupService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a new signup', async () => {
    const email = chance.email();
    const name = chance.name();

    const signup = await service.create(email, name);

    expect(signup).toMatchObject({
      email,
      name,
      status: Status.Active,
    });

    expect(
      DateTime.fromJSDate(signup.expires_at)
        .diff(DateTime.fromJSDate(signup.created_at), 'minutes')
        .toObject().minutes,
    ).toBeCloseTo(5);
  });

  it('should throw an exception if the mailer fails', async () => {
    jest
      .spyOn(mailerMock, 'send')
      .mockImplementation(async () =>
        Promise.reject(new Error('An error occurred sending email.')),
      );

    await expect(
      service.create(chance.email(), chance.name()),
    ).rejects.toThrowError();
  });
});
