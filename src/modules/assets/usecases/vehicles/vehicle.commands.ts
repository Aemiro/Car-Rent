import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserInfo } from '@lib/common/user-info';
import { VehicleEntity } from '@asset/persistence/vehicles/vehicle.entity';
import { VehicleStatus } from '@asset/enum';

export class CreateVehicleCommand {
  @ApiProperty()
  @IsNotEmpty()
  plateNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  model: string;
  @ApiProperty()
  make: string;
  @ApiProperty()
  @IsNotEmpty()
  year: number;
  @ApiProperty()
  registrationNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  vin: string;
  @ApiProperty()
  engineNumber: string;
  @ApiProperty()
  color: string;
  @ApiProperty()
  vehicleTypeId: string;

  @ApiProperty()
  @IsNotEmpty()
  monthlyRentalRate: number;
  @ApiProperty()
  @IsNotEmpty()
  weeklyRentalRate: number;
  @ApiProperty()
  @IsEnum(VehicleStatus, {
    message: `Vehicle status must be one of ${Object.keys(
      VehicleStatus,
    ).toString()}`,
  })
  status: string;
  currentUser: UserInfo;

  static toEntity(command: CreateVehicleCommand): VehicleEntity {
    const entity = new VehicleEntity();
    entity.plateNumber = command.plateNumber;
    entity.model = command.model;
    entity.make = command.make;
    entity.year = command.year;
    entity.registrationNumber = command.registrationNumber;
    entity.vin = command.vin;
    entity.engineNumber = command.engineNumber;
    entity.color = command.color;
    entity.vehicleTypeId = command.vehicleTypeId;
    entity.monthlyRentalRate = command.monthlyRentalRate;
    entity.weeklyRentalRate = command.weeklyRentalRate;
    entity.status = command.status;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateVehicleCommand extends PartialType(CreateVehicleCommand) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchiveVehicleCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
