import { ApiProperty } from '@nestjs/swagger';
import { VehicleResponse } from '../vehicles/vehicle.response';
import { MaintenanceAlertEntity } from '@asset/persistence/maintenance-alerts/maintenance-alert.entity';

export class MaintenanceAlertResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  vehicleId: string;
  @ApiProperty()
  maintenanceId: string;
  @ApiProperty()
  alertType: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  dueDate: Date;
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
  vehicle?: VehicleResponse;

  static toResponse(entity: MaintenanceAlertEntity): MaintenanceAlertResponse {
    const response = new MaintenanceAlertResponse();
    response.id = entity.id;
    response.vehicleId = entity.vehicleId;
    response.maintenanceId = entity.maintenanceId;
    response.alertType = entity.alertType;
    response.message = entity.message;
    response.dueDate = entity.dueDate;
    response.status = entity.status;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.vehicle) {
      response.vehicle = VehicleResponse.toResponse(entity.vehicle);
    }
    return response;
  }
}
