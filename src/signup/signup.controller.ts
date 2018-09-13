import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSignupDto } from './dto/create-signup.dto';
import { SignupService } from './signup.service';

@Controller('signups')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createSignupDto: CreateSignupDto) {
    return this.signupService
      .create(createSignupDto.email, createSignupDto.name)
      .then(signup => ({
        id: signup.id,
      }))
      .catch(() => {
        throw new InternalServerErrorException('Error creating signup.');
      });
  }
}
