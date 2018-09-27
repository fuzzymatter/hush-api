import request = require('supertest');
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, createConnection, Repository } from 'typeorm';
import { Chance } from 'chance';
import uuid from 'uuid';
import shortid from 'shortid';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { ConfigService } from '../src/config/config.service';
import { SignupService } from '../src/signup/signup.service';
import { Status, Signup } from '../src/signup/signup.entity';
import { VerifiedSignupController } from '../src/verified-signup/verified-signup.controller';
import { MailerService } from '../src/mailer/mailer.service';

const chance = new Chance();
const configService = new ConfigService('.env');

const RSA_PUBLIC_KEY = `
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v3.1.0
Comment: https://openpgpjs.org

xsBNBFtcGWABCACltOSYctC9XPKx5B6xBI3rbo6AbnuqLGV82sLXXmvvyPRQ
XFPkw8KrVzWO8LU4ZChuCG/V3KTFW8lh5HAXfo5LrFEUmPBzRwizGSUh/4Sy
/6+QZfyRukcXOQDscGSx4hi0cw7aYuRHf3v6zCKO+2grO2razeXFJstNj4Fa
pktQYKDcpGcpJup1pVL+YM2y77fWsMB4LchAv/oTs7QS26MzS1Gvs0PykbZ5
pAS/swuDm+qpM9gxBwvEYHejF9eNYBciUHv9MzDdf1vBcWSYqYal98g9FAvd
lTes5pcPm2UBIHGFf2uTo3N+5rAUsHq9Re7dIfWmvqDto1I0XSdfZd+1ABEB
AAHNHlRoZW9kb3JlIFNvdG8gPHZpenVAdGFndWdpLnZjPsLAdQQQAQgAKQUC
W1wZYAYLCQcIAwIJEBoNfrHUuu7tBBUICgIDFgIBAhkBAhsDAh4BAABwWAf+
PxV7Fwp236gHuGl3/Rc88Q8nIdAw/tYt38dVva1/fRd9plPuvMA0e4NyRkC2
u9IPYBA0n2ZKEq6aw9sShkKMS1tXg2AZhu1zxY2SUvsTN2tLsgBTigDfQxPc
Uvlprc/mG+tQ2oZrTNKvk4Lt5GlNH8qMXMUKo5ZWCdzWrrB9ZcDOus4yzi5s
Hg9A8ukPLEa6pJ8XLdHnHjm2ETK4HYWo6vV380c8yEMlARsxnNhTHgYqLz69
fDfnSu0OW86Onj9ZsS0ITM74UtQbZ3amhIoEg9uribpxywzR39mpkVa3wgco
nz7i4c9MmF2C4R0fO6laIWz3r0yy1NQDIl4iklIoxM7ATQRbXBlgAQgAkb7M
giaBBY+74YEznDX6HWWgy0g3p3BWohxJZH5vD0CDDJcKEVddpS+UTeYHXf2B
xDUNwYAlVVDsfs3wWv/btV1uWdMR8pmjg9q97FR0RrT1TA/ah7hYT0dmLZy1
8UcX3mp4DxKjB7cJ+Q4aH93GVbadIFUYHRRb46IGOLaummjVnEf78gtJk3+0
bxRQN08HZpNQy51waCB5+ZTEKvlsOQZT9GAee3/FdWZMgyyrIFRmTZIe/UBP
r8k9za2QvrFYPuOm5HLN5Hi4alRT7/rUl7+ANinnbVp69JUCIZhm3XpgxZr2
fdtWLvCcalmZTcLZkCm3zNI4e9V/p+YA0dsVZwARAQABwsBfBBgBCAATBQJb
XBlgCRAaDX6x1Lru7QIbDAAAhtEH/3NsoLYF8/3EBvIqX71UChvoxJOaxv2b
xe38vvjE35w2qJ8HqQBU4JyUDw4eDW2DEjb7IxFvfAoWD+R4IEEfN0HhTDTE
dGdInMbx0unERClmIN8SgpX1BV/OTbXwc9PXmINkX/+HG2ssD93wpTsR0aFn
JgeDdgxJhWGYNZ28i7cNNfLdTINZQ8oOnjp7N5ADziGcVJXVb+gTSK+Wc2RO
N+CDo8DLz32W3FUJUu2pKfTg/s5qjZf6EESSO76rHiv+Lwcqf7oBi4FKmVmH
6KXkIcmx0PjRgr+lMWD0Kn/xT5UZeg5q+sJmpQMxWSEX6VLW6E6fPRCfQgoB
5bb4U5qRSKA=
=dsLP
-----END PGP PUBLIC KEY BLOCK-----

`;

const RSA_PRIVATE_KEY = `
-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v3.1.0
Comment: https://openpgpjs.org

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
tvhTmpFIoA==
=U6un
-----END PGP PRIVATE KEY BLOCK-----

`;

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
      .overrideProvider(MailerService)
      .useValue({ async send() {} })
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
          publicKey: RSA_PUBLIC_KEY,
          privateKey: RSA_PRIVATE_KEY,
          deviceName: chance.word(),
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
          publicKey: RSA_PUBLIC_KEY,
          privateKey: RSA_PRIVATE_KEY,
          deviceName: chance.word(),
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
          publicKey: RSA_PUBLIC_KEY,
          privateKey: RSA_PRIVATE_KEY,
          deviceName: chance.word(),
        })
        .expect(409);
    });
  });
});
