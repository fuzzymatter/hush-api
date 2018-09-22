import { ApiModelProperty } from '@nestjs/swagger';

export class TimeRemaining {
  @ApiModelProperty()
  minutes: number;

  @ApiModelProperty()
  seconds: number;
}

export class CreateSignupResponseDto {
  @ApiModelProperty()
  readonly id: string;

  @ApiModelProperty({
    description: 'Time before the signup expires.',
  })
  readonly timeRemaining: TimeRemaining;
}
