import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '@lib/common/file-dto';
import { TenantResponse } from './tenant.response';
import { DocumentTypeResponse } from '@setting/usecases/document-types/document-type.response';
import { TenantDocumentEntity } from '@customer/persistence/tenants/tenant-document.entity';

export class TenantDocumentResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  tenantId: string;
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
  tenant?: TenantResponse;
  documentType?: DocumentTypeResponse;

  static toResponse(entity: TenantDocumentEntity): TenantDocumentResponse {
    const response = new TenantDocumentResponse();
    response.id = entity.id;
    response.tenantId = entity.tenantId;
    response.documentTypeId = entity.documentTypeId;
    response.expirationDate = entity.expirationDate;
    response.file = entity.file;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.tenant) {
      response.tenant = TenantResponse.toResponse(entity.tenant);
    }
    if (entity.documentType) {
      response.documentType = DocumentTypeResponse.toResponse(
        entity.documentType,
      );
    }
    return response;
  }
}
