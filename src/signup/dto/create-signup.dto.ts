import { IsEmail, IsString, Length } from 'class-validator';

export class CreateSignupDto {
  @IsEmail()
  @Length(8, 255)
  readonly email: string;

  @IsString()
  @Length(2, 100)
  readonly name: string;
}
