import request = require('supertest');
import sinon = require('sinon');
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, createConnection } from 'typeorm';
import { Chance } from 'chance';
import { AppModule } from '../src/app.module';
import { MailerService } from '../src/mailer/mailer.service';
import { ConfigService } from '../src/config/config.service';
import { SignupService } from '../src/signup/signup.service';

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
          sinon.assert.match(body, {
            id: sinon.match(/.{20,}/),
            timeRemaining: sinon.match({
              minutes: sinon.match.number,
              seconds: sinon.match.number,
            }),
          });
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
          sinon.assert.match(body, {
            id: sinon.match(/.{20,}/),
            timeRemaining: sinon.match({
              minutes: sinon.match.number,
              seconds: sinon.match.number,
            }),
          });
        });
    });
  });

  describe('/signups/:id/verify (POST)', async () => {
    it('404', async () => {
      jest.spyOn(mailerService, 'send').mockImplementation(() => {});
      const signupService = moduleFixture.get<SignupService>(SignupService);

      const { signup } = await signupService.create(
        chance.email(),
        chance.name(),
      );

      await request(app.getHttpServer())
        .post(`/signups/${signup.id}/verify`)
        .send({
          code: signup.code,
        })
        .expect(200);
    });
  });
});
