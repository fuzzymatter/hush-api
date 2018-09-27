import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVerifiedSignupDto {
  @IsString()
  @ApiModelProperty({
    required: true,
  })
  signupId: string;

  @IsString()
  @ApiModelProperty({
    description: 'Verification code.',
    required: true,
  })
  code: string;

  @IsString()
  @ApiModelProperty({
    description: 'RSA public key.',
    required: true,
  })
  readonly publicKey: string;

  @IsString()
  @ApiModelProperty({
    description:
      'Encrypted RSA private key. This should be encrypted with a strong, generated password.',
    required: true,
  })
  readonly privateKey: string;

  @IsString()
  @ApiModelProperty({
    description:
      'Device name that will be attached to the authenication token.',
    required: true,
  })
  readonly deviceName: string;
}
