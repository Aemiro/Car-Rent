import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserInfo } from '@lib/common/user-info';
import { VehicleTypeEntity } from '@asset/persistence/vehicle-types/vehicle.type.entity';

export class CreateVehicleTypeCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  isActive?: boolean;

  currentUser: UserInfo;

  static toEntity(command: CreateVehicleTypeCommand): VehicleTypeEntity {
    const entity = new VehicleTypeEntity();
    entity.name = command.name;
    entity.description = command.description;
    entity.isActive = command.isActive;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateVehicleTypeCommand extends PartialType(
  CreateVehicleTypeCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchiveVehicleTypeCommand {
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
