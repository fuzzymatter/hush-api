import { Injectable } from '@nestjs/common';
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

  async create(
    email: string,
    name: string,
  ): Promise<{ isNew: boolean; signup: Signup }> {
    const verified = await this.findVerified(email);

    if (verified) {
      return { isNew: false, signup: verified };
    }

    const existing = await this.findExistingActive(email);

    if (existing) {
      return { isNew: false, signup: existing };
    }

    const signup = new Signup(email, name);
    const text = `Hi ${
      signup.name
    },\n\nhere is your signup verification code: ${signup.code}.`;
    const html = `Hello ${
      signup.name
    },\n\nHere is your signup verification code: <strong>${
      signup.code
    }</strong>.`;

    await this.mailer.send({
      to: email,
      from: 'no-reply@hushdomain.com',
      subject: 'Your Hush Signup Code',
      text,
      html,
    });

    await this.signupRepository.save(signup);

    return { isNew: true, signup };
  }

  findVerified(email) {
    return this.signupRepository
      .createQueryBuilder('signup')
      .where('signup.email = :email AND signup.status = :status', {
        email,
        status: Status.Verified,
      })
      .getOne();
  }

  findExistingActive(email) {
    return this.signupRepository
      .createQueryBuilder('signup')
      .where('signup.expires_at > now() AND signup.email = :email', { email })
      .getOne();
  }
}
