import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { SignupService } from './signup.service';
import { MailerService, MessageData } from '../mailer/mailer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
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
    const signup = new Signup();
    signup.email = chance.email();
    signup.name = chance.name();

    await expect(
      service.create(signup.email, signup.name),
    ).resolves.toMatchObject({
      ...signup,
      status: Status.Active,
    });
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
