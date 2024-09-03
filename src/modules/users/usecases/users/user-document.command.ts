import { FileDto } from '@lib/common/file-dto';
import { UserInfo } from '@lib/common/user-info';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserDocumentEntity } from '@user/persistence/users/user-document.entity';
import { IsNotEmpty } from 'class-validator';
export class AddUserDocumentCommand {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
  @ApiProperty()
  @IsNotEmpty()
  documentTypeId: string;
  @ApiProperty()
  expirationDate: Date;
  file: FileDto;
  currentUser?: UserInfo;
  static toEntity(command: AddUserDocumentCommand): UserDocumentEntity {
    const entity = new UserDocumentEntity();
    entity.userId = command.userId;
    entity.documentTypeId = command.documentTypeId;
    entity.expirationDate = command.expirationDate;
    entity.file = command.file;
    entity.updatedBy = command?.currentUser?.id;
    entity.createdBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateUserDocumentCommand extends PartialType(
  AddUserDocumentCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}

export class RemoveUserDocumentCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
  currentUser: UserInfo;
}
