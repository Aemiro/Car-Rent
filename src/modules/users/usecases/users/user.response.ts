import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../persistence/users/user.entity';
import { Address } from '@lib/common/address';
import { FileDto } from '@lib/common/file-dto';

export class UserResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  middleName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  firebaseUserId: string;
  @ApiProperty()
  jobTitle: string;
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

  static toResponse(entity: UserEntity): UserResponse {
    const response = new UserResponse();
    response.id = entity.id;
    response.firstName = entity.firstName;
    response.middleName = entity.middleName;
    response.lastName = entity.lastName;
    response.email = entity.email;
    response.phone = entity.phone;
    response.jobTitle = entity.jobTitle;
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
    return response;
  }
}
