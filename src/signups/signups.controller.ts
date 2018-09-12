import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateSignupDto } from './dto/create-signup.dto';
import { MailerService } from '../mailer/mailer.service';

@Controller('signups')
export class SignupsController {
  constructor(private readonly mailer: MailerService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createSignupDto: CreateSignupDto) {
    return createSignupDto.email;
  }
}
