import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Signup, Status } from '../../src/signup/signup.entity';
import { CreateVerifiedSignupDto } from './dto/create-verfied-signup';

@Controller('verified-signups')
export class VerifiedSignupController {
  constructor(
    @InjectRepository(Signup)
    private readonly signupRepository: Repository<Signup>,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createVerifiedSignupDto: CreateVerifiedSignupDto) {
    const signup = await this.signupRepository.findOne(
      createVerifiedSignupDto.signupId,
    );

    if (!signup) {
      throw new NotFoundException();
    }

    if (signup.status === Status.Verified) {
      throw new ConflictException('Signup is already verified.');
    }

    signup.status = Status.Verified;
    await this.signupRepository.save(signup);
  }
}
