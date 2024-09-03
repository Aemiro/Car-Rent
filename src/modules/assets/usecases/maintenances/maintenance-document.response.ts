import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '@lib/common/file-dto';
import { MaintenanceResponse } from './maintenance.response';
import { DocumentTypeResponse } from '@setting/usecases/document-types/document-type.response';
import { MaintenanceDocumentEntity } from '@asset/persistence/maintenances/maintenance-document.entity';

export class MaintenanceDocumentResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  maintenanceId: string;
  @ApiProperty()
  documentTypeId: string;
  @ApiProperty()
  file: FileDto;
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
  maintenance?: MaintenanceResponse;
  documentType?: DocumentTypeResponse;

  static toResponse(
    entity: MaintenanceDocumentEntity,
  ): MaintenanceDocumentResponse {
    const response = new MaintenanceDocumentResponse();
    response.id = entity.id;
    response.maintenanceId = entity.maintenanceId;
    response.documentTypeId = entity.documentTypeId;
    response.file = entity.file;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.maintenance) {
      response.maintenance = MaintenanceResponse.toResponse(entity.maintenance);
    }
    if (entity.documentType) {
      response.documentType = DocumentTypeResponse.toResponse(
        entity.documentType,
      );
    }
    return response;
  }
}
