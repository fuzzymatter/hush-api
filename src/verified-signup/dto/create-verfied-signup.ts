import { IsString } from 'class-validator';

export class CreateVerifiedSignupDto {
  @IsString()
  signupId: string;

  @IsString()
  code: string;

  @IsString()
  readonly publicKey: string;

  @IsString()
  readonly privateKey: string;
}
