import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Chance } from 'chance';
import uuid from 'uuid';
import { SignupService } from './signup.service';
import { MailerService, MessageData } from '../mailer/mailer.service';
import { Signup, Status } from './signup.entity';

const chance = new Chance();

describe('SignupService', () => {
  let module: TestingModule;
  let service: SignupService;

  const mailerMock = {
    async send(messageData: MessageData) {
      return { success: true };
    },
  };

  const createMockSignupRepository = jest.fn(() => ({
    createQueryBuilder: () => ({
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnValue(null),
    }),

    save: jest.fn().mockResolvedValue(true),
  }));

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        SignupService,
        {
          provide: getRepositoryToken(Signup),
          useValue: createMockSignupRepository(),
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

    jest.spyOn(service, 'findVerified').mockResolvedValue(null);
    jest.spyOn(service, 'findExistingActive').mockResolvedValue(null);
    const { isNew, signup } = await service.create(email, name);

    expect(isNew).toBe(true);

    expect(signup).toMatchObject({
      email,
      name,
      status: Status.Active,
    });

    expect(
      DateTime.fromJSDate(signup.expiresAt)
        .diff(DateTime.fromJSDate(new Date()), 'minutes')
        .toObject().minutes,
    ).toBeCloseTo(5);
  });

  it('should return existing active signup', async () => {
    const email = chance.email();
    const name = chance.name();

    const existing = new Signup(email, name);
    existing.id = uuid.v4();

    jest.spyOn(service, 'findVerified').mockResolvedValue(null);
    jest.spyOn(service, 'findExistingActive').mockResolvedValue(existing);
    const { isNew, signup } = await service.create(email, name);

    expect(isNew).toBe(false);
    expect(signup).toMatchObject(existing);
  });

  it('should return existing verified signup', async () => {
    const email = chance.email();
    const name = chance.name();

    const verified = new Signup(email, name);
    verified.id = uuid.v4();
    verified.status = Status.Verified;

    jest.spyOn(service, 'findVerified').mockResolvedValue(verified);
    jest.spyOn(service, 'findExistingActive').mockResolvedValue(null);
    const { isNew, signup } = await service.create(email, name);

    expect(isNew).toBe(false);
    expect(signup).toMatchObject(verified);
  });

  it('should throw an exception if the mailer fails', async () => {
    jest
      .spyOn(mailerMock, 'send')
      .mockRejectedValue(new Error('An error occurred sending email.'));

    await expect(
      service.create(chance.email(), chance.name()),
    ).rejects.toThrowError();
  });
});
