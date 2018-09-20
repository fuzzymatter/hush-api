import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { Signup } from './signup.entity';
import { MailerService } from '../mailer/mailer.service';

describe('Signup Controller', () => {
  let module: TestingModule;

  const createMockSignupRepository = jest.fn(() => ({
    createQueryBuilder: {
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnValue(null),
    },

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
          useValue: { send: jest.fn().mockResolvedValue(true) },
        },
      ],
      controllers: [SignupController],
    }).compile();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    const controller: SignupController = module.get<SignupController>(
      SignupController,
    );

    expect(controller).toBeDefined();
  });
});
