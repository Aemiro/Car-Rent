import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '@lib/common/file-dto';
import { VehicleResponse } from './vehicle.response';
import { VehicleDocumentEntity } from '@asset/persistence/vehicles/vehicle-document.entity';
import { DocumentTypeResponse } from '@setting/usecases/document-types/document-type.response';

export class VehicleDocumentResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  vehicleId: string;
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
  vehicle?: VehicleResponse;
  documentType?: DocumentTypeResponse;

  static toResponse(entity: VehicleDocumentEntity): VehicleDocumentResponse {
    const response = new VehicleDocumentResponse();
    response.id = entity.id;
    response.vehicleId = entity.vehicleId;
    response.documentTypeId = entity.documentTypeId;
    response.expirationDate = entity.expirationDate;
    response.file = entity.file;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.vehicle) {
      response.vehicle = VehicleResponse.toResponse(entity.vehicle);
    }
    if (entity.documentType) {
      response.documentType = DocumentTypeResponse.toResponse(
        entity.documentType,
      );
    }
    return response;
  }
}
