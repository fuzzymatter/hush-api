import request = require('supertest');
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { Chance } from 'chance';
import uuid from 'uuid';
import shortid from 'shortid';
import { AppModule } from '../src/app.module';
import { ConfigService } from '../src/config/config.service';
import { SignupService } from '../src/signup/signup.service';
import { Status, Signup } from '../src/signup/signup.entity';
import { VerifiedSignupController } from '../src/verified-signup/verified-signup.controller';
import { getRepositoryToken } from '@nestjs/typeorm';

const chance = new Chance();
const configService = new ConfigService('.env');

describe('VerifiedSignupController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    connection = await createConnection({
      type: configService.env.TYPEORM_CONNECTION,
      host: configService.env.TYPEORM_HOST,
      port: configService.env.TYPEORM_PORT,
      username: configService.env.TYPEORM_USERNAME,
      password: configService.env.TYPEORM_PASSWORD,
      database: 'hush_test',
      entities: configService.env.TYPEORM_ENTITIES,
      synchronize: configService.env.TYPEORM_SYNCHRONIZE,
    });

    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Connection)
      .useValue(connection)
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  beforeAll(async () => {
    await connection.synchronize(true);
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  afterEach(async () => {
    await connection.synchronize(true);
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    const controller = moduleFixture.get<VerifiedSignupController>(
      VerifiedSignupController,
    );

    expect(controller).toBeDefined();
  });

  describe('/verified-signups (POST)', async () => {
    it('should mark an active signup as verified', async () => {
      const signupService = moduleFixture.get<SignupService>(SignupService);

      const { signup } = await signupService.create(
        chance.email(),
        chance.name(),
      );

      await request(app.getHttpServer())
        .post('/verified-signups')
        .send({
          signupId: signup.id,
          code: shortid(),
          publicKey: '',
          privateKey: '',
        })
        .expect(201);
    });

    it('should respond with 404 NotFound if signup not found', async () => {
      const signupService = moduleFixture.get<SignupService>(SignupService);

      await request(app.getHttpServer())
        .post('/verified-signups')
        .send({
          signupId: uuid.v4(),
          code: shortid(),
          publicKey: '',
          privateKey: '',
        })
        .expect(404);
    });

    it('should respond with 409 Conflict if signup already verified', async () => {
      const signupService = moduleFixture.get<SignupService>(SignupService);
      const signupRepository = moduleFixture.get<Repository<{}>>(
        getRepositoryToken(Signup),
      );

      const { signup } = await signupService.create(
        chance.email(),
        chance.name(),
      );
      signup.status = Status.Verified;
      await signupRepository.save(signup);

      await request(app.getHttpServer())
        .post('/verified-signups')
        .send({
          signupId: signup.id,
          code: shortid(),
          publicKey: '',
          privateKey: '',
        })
        .expect(409);
    });
  });
});
