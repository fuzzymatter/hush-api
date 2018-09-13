import { Test, TestingModule } from '@nestjs/testing';
import * as cuid from 'cuid';
import { Chance } from 'chance';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

const chance = new Chance();

describe('Signup Controller', () => {
  let module: TestingModule;
  const signupServiceMock = {
    async create(email: string, name: string) {
      return { id: cuid() };
    },
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: SignupService,
          useValue: signupServiceMock,
        },
      ],
      controllers: [SignupController],
    }).compile();
  });

  it('should be defined', () => {
    const controller: SignupController = module.get<SignupController>(
      SignupController,
    );

    expect(controller).toBeDefined();
  });

  it('should return a new signup', async () => {
    const controller: SignupController = module.get<SignupController>(
      SignupController,
    );

    await expect(
      controller.create({
        email: chance.email(),
        name: chance.name(),
      }),
    ).resolves.toMatchObject({
      id: expect.stringMatching(/.{20,}/),
    });
  });

  it('should throw InternalServerErrorException if SignupService.create() fails', async () => {
    const controller: SignupController = module.get<SignupController>(
      SignupController,
    );

    jest
      .spyOn(signupServiceMock, 'create')
      .mockImplementation(async () =>
        Promise.reject('Failed to create signup.'),
      );

    await expect(
      controller.create({
        email: chance.email(),
        name: chance.name(),
      }),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
