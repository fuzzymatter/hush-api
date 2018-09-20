import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { CreateSignupDto } from './dto/create-signup.dto';
import { SignupService } from './signup.service';
import { Response } from 'express';

@Controller('signups')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Res() res: Response, @Body() createSignupDto: CreateSignupDto) {
    return this.signupService
      .create(createSignupDto.email, createSignupDto.name)
      .then(({ isNew, signup }) => {
        res.status(isNew ? HttpStatus.CREATED : HttpStatus.OK).json({
          id: signup.id,
          timeRemaining: signup.timeRemaining,
        });
      });
  }
}
