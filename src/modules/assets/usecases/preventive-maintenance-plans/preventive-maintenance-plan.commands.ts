import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserInfo } from '@lib/common/user-info';
import { PreventiveMaintenancePlanEntity } from '@asset/persistence/preventive-maintenance-plans/preventive-maintenance-plan.entity';

export class CreatePreventiveMaintenancePlanCommand {
  @ApiProperty()
  @IsNotEmpty()
  vehicleId: string;
  @ApiProperty()
  @IsNotEmpty()
  maintenanceType: string;
  @ApiProperty()
  intervalType: string;
  @ApiProperty()
  @IsNotEmpty()
  intervalValue: number;
  currentUser: UserInfo;

  static toEntity(
    command: CreatePreventiveMaintenancePlanCommand,
  ): PreventiveMaintenancePlanEntity {
    const entity = new PreventiveMaintenancePlanEntity();
    entity.vehicleId = command.vehicleId;
    entity.maintenanceType = command.maintenanceType;
    entity.intervalType = command.intervalType;
    entity.intervalValue = command.intervalValue;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdatePreventiveMaintenancePlanCommand extends PartialType(
  CreatePreventiveMaintenancePlanCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchivePreventiveMaintenancePlanCommand {
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
