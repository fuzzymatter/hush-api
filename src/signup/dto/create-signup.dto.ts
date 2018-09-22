import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateSignupDto {
  @IsEmail()
  @Length(8, 255)
  @ApiModelProperty({
    required: true,
  })
  readonly email: string;

  @IsString()
  @Length(2, 100)
  @ApiModelProperty({
    required: true,
  })
  readonly name: string;
}
