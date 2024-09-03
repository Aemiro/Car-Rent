import { VehicleTypeEntity } from '@asset/persistence/vehicle-types/vehicle.type.entity';
import { ApiProperty } from '@nestjs/swagger';

export class VehicleTypeResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  isActive?: boolean;
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
  static toResponse(entity: VehicleTypeEntity): VehicleTypeResponse {
    const response = new VehicleTypeResponse();
    response.id = entity.id;
    response.name = entity.name;
    response.description = entity.description;

    response.isActive = entity.isActive;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    return response;
  }
}
