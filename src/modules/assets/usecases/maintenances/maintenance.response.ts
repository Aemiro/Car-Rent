import { MaintenanceEntity } from '@asset/persistence/maintenances/maintenance.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceDocumentResponse } from './maintenance-document.response';
import { VehicleResponse } from '../vehicles/vehicle.response';

export class MaintenanceResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  vehicleId: string;
  @ApiProperty()
  maintenanceType: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  scheduledDate: Date;
  @ApiProperty()
  actualDate: Date;
  @ApiProperty()
  cost: number;
  @ApiProperty()
  status: string;
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
  documents?: MaintenanceDocumentResponse[];
  vehicle?: VehicleResponse;
  // maintenanceAlerts?: MaintenanceAlertResponse[];

  static toResponse(entity: MaintenanceEntity): MaintenanceResponse {
    const response = new MaintenanceResponse();
    response.id = entity.id;
    response.vehicleId = entity.vehicleId;
    response.maintenanceType = entity.maintenanceType;
    response.description = entity.description;
    response.scheduledDate = entity.scheduledDate;
    response.actualDate = entity.actualDate;
    response.cost = entity.cost;
    response.status = entity.status;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if(entity.vehicle) {
      response.vehicle = VehicleResponse.toResponse(entity.vehicle);
    }
    if (entity.documents) {
      response.documents = entity.documents.map((document) =>
        MaintenanceDocumentResponse.toResponse(document),
      );
    }
    return response;
  }
}
