import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/signups (POST)', () => {
    return request(app.getHttpServer())
      .post('/signups')
      .send({
        email: 'user@example.org',
      })
      .expect(202)
      .expect('user@example.org');
  });
});
