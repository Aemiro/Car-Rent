import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserEntity } from '../../persistence/users/user.entity';
import { Gender } from '@lib/common/enums';
import { UserInfo } from '@lib/common/user-info';
import { Address } from '@lib/common/address';
export class CreateUserCommand {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  middleName: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty({
    example: 'someone@gmail.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: '+251911111111',
  })
  @IsNotEmpty()
  phone: string;
  @ApiProperty({
    enum: Gender,
  })
  @IsEnum(Gender, {
    message: 'User Gender must be either male or female',
  })
  gender: string;
  @ApiProperty()
  jobTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  address: Address;
  isAllowBulk: boolean;
  currentUser: UserInfo;

  static toEntity(command: CreateUserCommand): UserEntity {
    const entity = new UserEntity();
    entity.firstName = command.firstName;
    entity.middleName = command.middleName;
    entity.lastName = command.lastName;
    entity.email = command.email;
    entity.phone = command.phone;
    entity.gender = command.gender;
    entity.jobTitle = command.jobTitle;
    entity.isActive = true;
    entity.address = command.address;
    return entity;
  }
}
export class UpdateUserCommand extends PartialType(CreateUserCommand) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  isActive: boolean;
}
export class ArchiveUserCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
