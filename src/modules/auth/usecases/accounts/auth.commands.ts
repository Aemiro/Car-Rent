import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../decorators/match.decorator';
import { UserInfo } from '@lib/common/user-info';
export class UserLoginCommand {
  @ApiProperty({ default: 'info@Kachamale.com' })
  @IsNotEmpty()
  email: string;
  @ApiProperty({ default: 'P@ssw0rd' })
  @IsNotEmpty()
  password: string;
}
export class ChangePasswordCommand {
  @ApiProperty()
  @IsNotEmpty()
  currentPassword: string;
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(64)
  //@Matches(RegExp('^[a-zA-Z0-9\\-]+$'))
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S+$/, {
  //   message:
  //     'password too weak, It must be combination of Uppercase, lowercase, special character and numbers',
  // })
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  @Match(ChangePasswordCommand, (s) => s.password, {
    message: 'Please confirm your password',
  })
  confirmPassword: string;
  currentUser: UserInfo;
}
export class UpdatePasswordCommand {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(64)
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S+$/, {
  //   message:
  //     'password too weak, It must be combination of Uppercase, lowercase, special character and numbers',
  // })
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  @Match(UpdatePasswordCommand, (s) => s.password, {
    message: 'Please confirm your password',
  })
  confirmPassword: string;
  @ApiProperty()
  @IsNotEmpty()
  email: string;
}
