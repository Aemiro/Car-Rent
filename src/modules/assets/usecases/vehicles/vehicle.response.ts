import { VehicleEntity } from '@asset/persistence/vehicles/vehicle.entity';
import { ApiProperty } from '@nestjs/swagger';

export class VehicleResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  model: string;
  @ApiProperty()
  make: string;
  @ApiProperty()
  year: number;
  @ApiProperty()
  registrationNumber: string;
  @ApiProperty()
  vin: string;
  @ApiProperty()
  engineNumber: string;
  @ApiProperty()
  color: string;
  @ApiProperty()
  vehicleTypeId: string;
  @ApiProperty()
  monthlyRentalRate: number;
  @ApiProperty()
  weeklyRentalRate: number;
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
  static toResponse(entity: VehicleEntity): VehicleResponse {
    const response = new VehicleResponse();
    response.id = entity.id;
    response.model = entity.model;
    response.make = entity.make;
    response.year = entity.year;
    response.registrationNumber = entity.registrationNumber;
    response.vin = entity.vin;
    response.engineNumber = entity.engineNumber;
    response.color = entity.color;
    response.vehicleTypeId = entity.vehicleTypeId;
    response.monthlyRentalRate = entity.monthlyRentalRate;
    response.weeklyRentalRate = entity.weeklyRentalRate;
    response.status = entity.status;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    return response;
  }
}
