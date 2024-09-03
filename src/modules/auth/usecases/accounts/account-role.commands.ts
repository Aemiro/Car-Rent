import { UserInfo } from '@lib/common/user-info';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserRoleEntity } from 'modules/auth/persistence/accounts/user-role.entity';
export class CreateAccountRoleCommand {
  accountId: string;
  roleId: string;
  currentUser?: UserInfo;
  static toEntity(createAccountRole: CreateAccountRoleCommand): UserRoleEntity {
    const accountRole = new UserRoleEntity();
    accountRole.userId = createAccountRole.accountId;
    accountRole.roleId = createAccountRole.roleId;
    return accountRole;
  }
}
export class CreateAccountRolesCommand {
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  roles: string[];
  currentUser?: UserInfo;
}
export class UpdateAccountRoleCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  currentUser: UserInfo;
  static toEntity(
    updateAccountRole: UpdateAccountRoleCommand,
  ): UserRoleEntity {
    const accountRole = new UserRoleEntity();
    accountRole.id = updateAccountRole.id;
    accountRole.userId = updateAccountRole.accountId;
    accountRole.roleId = updateAccountRole.roleId;
    return accountRole;
  }
}
export class DeleteAccountRoleCommand {
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  currentUser: UserInfo;
}
export class ArchiveAccountRoleCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  currentUser: UserInfo;
}
