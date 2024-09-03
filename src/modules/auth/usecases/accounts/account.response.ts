import { ApiProperty } from '@nestjs/swagger';
import { Address } from '@lib/common/address';
import { FileDto } from '@lib/common/file-dto';
import { UserRoleResponse } from './user-role.response';
import { AccountEntity } from '../../persistence/accounts/account.entity';

export class AccountResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  profilePicture: FileDto;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  address: Address;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;
  @ApiProperty()
  deletedBy: string;
  userRoles?: UserRoleResponse[];

  static toResponse(entity: AccountEntity): AccountResponse {
    const response = new AccountResponse();
    response.id = entity.id;
    response.name = entity.name;
    response.email = entity.email;
    response.phone = entity.phone;
    response.gender = entity.gender;
    response.profilePicture = entity.profilePicture;
    response.isActive = entity.isActive;
    response.address = entity.address;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.userRoles) {
      response.userRoles = entity.userRoles.map((userRole) =>
        UserRoleResponse.toResponse(userRole),
      );
    }
    return response;
  }
}
