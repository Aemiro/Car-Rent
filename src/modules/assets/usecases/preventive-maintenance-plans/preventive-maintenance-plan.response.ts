import { ApiProperty } from '@nestjs/swagger';
import { VehicleResponse } from '../vehicles/vehicle.response';
import { PreventiveMaintenancePlanEntity } from '@asset/persistence/preventive-maintenance-plans/preventive-maintenance-plan.entity';

export class PreventiveMaintenancePlanResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  vehicleId: string;
  @ApiProperty()
  maintenanceType: string;
  @ApiProperty()
  intervalType: string;
  @ApiProperty()
  intervalValue: number;
  @ApiProperty()
  lastPerformedDate: Date;
  @ApiProperty()
  nextDueDate: Date;
  @ApiProperty()
  lastPerformedMileage: number;
  @ApiProperty()
  nextDueMileage: number;
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

  static toResponse(
    entity: PreventiveMaintenancePlanEntity,
  ): PreventiveMaintenancePlanResponse {
    const response = new PreventiveMaintenancePlanResponse();
    response.id = entity.id;
    response.vehicleId = entity.vehicleId;
    response.maintenanceType = entity.maintenanceType;
    response.intervalType = entity.intervalType;
    response.intervalValue = entity.intervalValue;
    response.lastPerformedDate = entity.lastPerformedDate;
    response.nextDueDate = entity.nextDueDate;
    response.lastPerformedMileage = entity.lastPerformedMileage;
    response.nextDueMileage = entity.nextDueMileage;
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
