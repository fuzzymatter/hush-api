import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, createConnection } from 'typeorm';
import { Chance } from 'chance';
import { AppModule } from './../src/app.module';
import { MailerService } from '../src/mailer/mailer.service';
import { ConfigService } from '../src/config/config.service';
import { async } from 'rxjs/internal/scheduler/async';

const chance = new Chance();
const configService = new ConfigService('.env');

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mailerService: MailerService;
  let connection: Connection;

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

    const moduleFixture = await Test.createTestingModule({
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

  afterEach(() => jest.resetAllMocks());

  it('/signups (POST)', () => {
    jest.spyOn(mailerService, 'send').mockImplementation(async () => {});

    return request(app.getHttpServer())
      .post('/signups')
      .send({
        email: chance.email(),
        name: chance.name(),
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toMatch(/.{20,}/);
      });
  });
});
