import { Injectable } from '@nestjs/common';
import * as shortid from 'shortid';
import { DateTime } from 'luxon';
import { MailerService } from '../mailer/mailer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Signup, Status } from './signup.entity';

@Injectable()
export class SignupService {
  constructor(
    @InjectRepository(Signup)
    private readonly signupRepository: Repository<Signup>,
    private readonly mailer: MailerService,
  ) {}

  async create(email: string, name: string): Promise<Signup> {
    const text = `Hello ${name},\n\nHere is your signup verification code: ${shortid()}.`;
    const html = `Hello ${name},\n\nHere is your signup verification code: <strong>${shortid()}</strong>.`;

    await this.mailer.send({
      to: email,
      from: 'no-reply@hushdomain.com',
      subject: 'Your Hush Signup Code',
      text,
      html,
    });

    const signup = new Signup();
    signup.code = shortid();
    signup.email = email;
    signup.name = name;
    signup.status = Status.Active;
    signup.created_at = new Date();
    signup.updated_at = new Date();
    signup.expires_at = DateTime.local()
      .plus({ minutes: 5 })
      .toJSDate();

    await this.signupRepository.save(signup);

    return signup;
  }
}
