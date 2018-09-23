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
import {
  ApiCreatedResponse,
  ApiProduces,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateSignupDto } from './dto/create-signup.dto';
import { SignupService } from './signup.service';
import { Status } from './signup.entity';
import { CreateSignupResponseDto } from './dto/create-signup-response.dto';

@Controller('signups')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    title: 'Create Signup',
    description:
      'Create a new signup. A short code is sent to the email address for verification purposes.',
  })
  @ApiCreatedResponse({
    description: 'The signup was successfully created. Check your email.',
    type: CreateSignupResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
  @ApiConflictResponse({
    description: 'Email address has already been verified.',
  })
  @ApiProduces('application/json')
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
          expiresAt: signup.expiresAt,
        });
      });
  }
}
