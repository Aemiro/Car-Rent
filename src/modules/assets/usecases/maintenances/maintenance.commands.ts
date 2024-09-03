import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserInfo } from '@lib/common/user-info';
import { MaintenanceEntity } from '@asset/persistence/maintenances/maintenance.entity';

export class CreateMaintenanceCommand {
  @ApiProperty()
  @IsNotEmpty()
  vehicleId: string;
  @ApiProperty()
  @IsNotEmpty()
  maintenanceType: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  scheduledDate: Date;
  @ApiProperty()
  @IsNotEmpty()
  actualDate: Date;
  @ApiProperty()
  @IsNotEmpty()
  cost: number;

  @ApiProperty()
  status: string;
  currentUser: UserInfo;

  static toEntity(command: CreateMaintenanceCommand): MaintenanceEntity {
    const entity = new MaintenanceEntity();
    entity.vehicleId = command.vehicleId;
    entity.maintenanceType = command.maintenanceType;
    entity.description = command.description;
    entity.scheduledDate = command.scheduledDate;
    entity.actualDate = command.actualDate;
    entity.cost = command.cost;
    entity.status = command.status;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateMaintenanceCommand extends PartialType(
  CreateMaintenanceCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchiveMaintenanceCommand {
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
