import { ApiModelProperty } from '@nestjs/swagger';

export class CreateSignupResponseDto {
  @ApiModelProperty()
  readonly id: string;

  @ApiModelProperty({
    description: 'ISO date string when signup expires.',
  })
  readonly expiresAt: string;
}
