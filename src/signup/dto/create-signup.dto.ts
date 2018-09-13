import { IsEmail, IsString, Length } from 'class-validator';

export class CreateSignupDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(2, 30)
  readonly name: string;
}
