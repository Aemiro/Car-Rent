import { Address } from '@lib/common/address';
import { FileDto } from '@lib/common/file-dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AccountEntity } from 'modules/auth/persistence/accounts/account.entity';
export class CreateAccountCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
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
  @ApiProperty()
  @IsNotEmpty()
  type: string;
  @ApiProperty()
  @IsNotEmpty()
  role?: string[];
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  gender?: string;
  @ApiProperty()
  address?: Address;
  @ApiProperty()
  profilePicture?: FileDto;
  accountId: string;
  isActive: boolean;
  static toEntity(command: CreateAccountCommand): AccountEntity {
    const accountDomain = new AccountEntity();
    accountDomain.name = command.name;
    accountDomain.email = command.email;
    accountDomain.phone = command.phone;
    accountDomain.id = command.accountId;
    accountDomain.type = command.type.toLowerCase();
    accountDomain.isActive = command.isActive;
    accountDomain.password = command.password;
    accountDomain.gender = command.gender;
    accountDomain.address = command.address;
    accountDomain.profilePicture = command.profilePicture;
    return accountDomain;
  }
}
export class UpdateAccountCommand {
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  phone: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  gender?: string;
  @ApiProperty()
  address?: Address;
  @ApiProperty()
  profilePicture?: FileDto;
}
