import { IsEmail } from 'class-validator';

export class CreateSignupDto {
  @IsEmail()
  readonly email: string;
}
