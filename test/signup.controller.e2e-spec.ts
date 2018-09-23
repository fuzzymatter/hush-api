import request = require('supertest');
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, createConnection, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { Chance } from 'chance';
import { AppModule } from '../src/app.module';
import { MailerService } from '../src/mailer/mailer.service';
import { ConfigService } from '../src/config/config.service';
import { SignupService } from '../src/signup/signup.service';
import { Status, Signup } from '../src/signup/signup.entity';
import { SignupController } from '../src/signup/signup.controller';

const chance = new Chance();
const configService = new ConfigService('.env');

describe('SignupController (e2e)', () => {
  let app: INestApplication;
  let mailerService: MailerService;
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
    mailerService = moduleFixture.get<MailerService>(MailerService);

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
    const controller: SignupController = moduleFixture.get<SignupController>(
      SignupController,
    );

    expect(controller).toBeDefined();
  });

  describe('/signups (POST)', () => {
    it('should respond with a 201 and signup details for new signup', () => {
      jest.spyOn(mailerService, 'send').mockImplementation(async () => {});

      return request(app.getHttpServer())
        .post('/signups')
        .send({
          email: chance.email(),
          name: chance.name(),
        })
        .expect(201)
        .then(({ body }) => {
          expect(DateTime.fromISO(body.expiresAt).isValid).toBe(true);
          expect(body.id).toMatch(/.{20,}/);
        });
    });

    it('should respond with a 200 and signup details for existing active signup', async () => {
      jest.spyOn(mailerService, 'send').mockImplementation(async () => {});
      const signupService = moduleFixture.get<SignupService>(SignupService);

      const { signup } = await signupService.create(
        chance.email(),
        chance.name(),
      );

      return request(app.getHttpServer())
        .post('/signups')
        .send({
          email: signup.email,
          name: signup.name,
        })
        .expect(200)
        .then(({ body }) => {
          expect(DateTime.fromISO(body.expiresAt).isValid).toBe(true);
          expect(body.id).toMatch(/.{20,}/);
        });
    });

    it('should respond with a 409 and error message if email is already verified', async () => {
      jest.spyOn(mailerService, 'send').mockImplementation(async () => {});
      const signupService = moduleFixture.get<SignupService>(SignupService);
      const signupRepository = moduleFixture.get<Repository<Signup>>(
        getRepositoryToken(Signup),
      );

      const { signup } = await signupService.create(
        chance.email(),
        chance.name(),
      );

      signup.status = Status.Verified;
      await signupRepository.save(signup);

      return request(app.getHttpServer())
        .post('/signups')
        .send({
          email: signup.email,
          name: signup.name,
        })
        .expect(409)
        .then(({ body }) => {
          expect(body.message).toMatch(new RegExp(`${signup.email}`, 'gi'));
          expect(body.statusCode).toBe(HttpStatus.CONFLICT);
        });
    });
  });
});
