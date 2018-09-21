import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Res,
  ConflictException,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateSignupDto } from './dto/create-signup.dto';
import { SignupService } from './signup.service';
import { Status } from './signup.entity';

@Controller('signups')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Res() res: Response, @Body() createSignupDto: CreateSignupDto) {
    return this.signupService
      .create(createSignupDto.email, createSignupDto.name)
      .then(({ isNew, signup }) => {
        if (signup.status === Status.Verified) {
          throw new ConflictException(
            `Email "${signup.email}" has already been verified.`,
          );
        }

        res.status(isNew ? HttpStatus.CREATED : HttpStatus.OK).json({
          id: signup.id,
          timeRemaining: signup.timeRemaining,
        });
      });
  }
}
