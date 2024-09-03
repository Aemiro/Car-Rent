import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypeEntity } from '@setting/persistence/document-types/document.type.entity';

export class DocumentTypeResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  note: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  isContractDocument?: boolean;
  @ApiProperty()
  isFinanceDocument?: boolean;
  @ApiProperty()
  isDriverDocument?: boolean;
  @ApiProperty()
  isVehicleDocument?: boolean;
  @ApiProperty()
  hasExpirationDate?: boolean;
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
  static toResponse(entity: DocumentTypeEntity): DocumentTypeResponse {
    const response = new DocumentTypeResponse();
    response.id = entity.id;
    response.name = entity.name;
    response.note = entity.note;
    response.code = entity.code;
    response.isContractDocument = entity.isContractDocument;
    response.isFinanceDocument = entity.isFinanceDocument;
    response.isDriverDocument = entity.isDriverDocument;
    response.isVehicleDocument = entity.isVehicleDocument;
    response.hasExpirationDate = entity.hasExpirationDate;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    return response;
  }
}
