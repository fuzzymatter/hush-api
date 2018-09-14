import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { MailerService } from '../src/mailer/mailer.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mailerService: MailerService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    mailerService = moduleFixture.get<MailerService>(MailerService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => jest.resetAllMocks());

  it('/signups (POST)', () => {
    jest.spyOn(mailerService, 'send').mockImplementation(async () => {});

    return request(app.getHttpServer())
      .post('/signups')
      .send({
        email: 'jklassendev@gmail.com',
        name: 'Jake Klassen',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toMatch(/.{20,}/);
      });
  });
});
