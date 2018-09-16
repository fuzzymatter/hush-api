import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, createConnection } from 'typeorm';
import { Chance } from 'chance';
import { AppModule } from './../src/app.module';
import { MailerService } from '../src/mailer/mailer.service';

const chance = new Chance();

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mailerService: MailerService;
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'hush_test',
      entities: ['src/**/**.entity.ts', 'src/**/**.entity.js'],
      synchronize: true,
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

  afterAll(async () => {
    await connection.synchronize(true);
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
