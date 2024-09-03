import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserInfo } from '@lib/common/user-info';
import { MaintenanceAlertEntity } from '@asset/persistence/maintenance-alerts/maintenance-alert.entity';

export class CreateMaintenanceAlertCommand {
  @ApiProperty()
  @IsNotEmpty()
  vehicleId: string;
  @ApiProperty()
  @IsNotEmpty()
  maintenanceId: string;
  @ApiProperty()
  @IsNotEmpty()
  alertType: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  @IsNotEmpty()
  dueDate: Date;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  currentUser: UserInfo;

  static toEntity(
    command: CreateMaintenanceAlertCommand,
  ): MaintenanceAlertEntity {
    const entity = new MaintenanceAlertEntity();
    entity.vehicleId = command.vehicleId;
    entity.maintenanceId = command.maintenanceId;
    entity.alertType = command.alertType;
    entity.message = command.message;
    entity.dueDate = command.dueDate;
    entity.status = command.status;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateMaintenanceAlertCommand extends PartialType(
  CreateMaintenanceAlertCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchiveMaintenanceAlertCommand {
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
