import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '@lib/common/file-dto';
import { UserResponse } from './user.response';
import { DocumentTypeResponse } from '@setting/usecases/document-types/document-type.response';
import { UserDocumentEntity } from '@user/persistence/users/user-document.entity';

export class UserDocumentResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  documentTypeId: string;
  @ApiProperty()
  file: FileDto;
  @ApiProperty()
  expirationDate: Date;
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
  user?: UserResponse;
  documentType?: DocumentTypeResponse;

  static toResponse(entity: UserDocumentEntity): UserDocumentResponse {
    const response = new UserDocumentResponse();
    response.id = entity.id;
    response.userId = entity.userId;
    response.documentTypeId = entity.documentTypeId;
    response.expirationDate = entity.expirationDate;
    response.file = entity.file;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.user) {
      response.user = UserResponse.toResponse(entity.user);
    }
    if (entity.documentType) {
      response.documentType = DocumentTypeResponse.toResponse(
        entity.documentType,
      );
    }
    return response;
  }
}
