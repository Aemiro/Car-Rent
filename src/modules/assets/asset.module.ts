import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleTypeEntity } from './persistence/vehicle-types/vehicle.type.entity';
import { VehicleTypeCommand } from './usecases/vehicle-types/vehicle-type.usecase.command';
import { VehicleTypeQuery } from './usecases/vehicle-types/vehicle-type.usecase.query';
import { VehicleEntity } from './persistence/vehicles/vehicle.entity';
import { VehicleCommand } from './usecases/vehicles/vehicle.usecase.command';
import { VehicleQuery } from './usecases/vehicles/vehicle.usecase.query';
import { MaintenanceAlertEntity } from './persistence/maintenance-alerts/maintenance-alert.entity';
import { MaintenanceAlertRepository } from './persistence/maintenance-alerts/maintenance-alert.repository';
import { MaintenanceEntity } from './persistence/maintenances/maintenance.entity';
import { MaintenanceRepository } from './persistence/maintenances/maintenance.repositoty';
import { PreventiveMaintenancePlanEntity } from './persistence/preventive-maintenance-plans/preventive-maintenance-plan.entity';
import { PreventiveMaintenancePlanRepository } from './persistence/preventive-maintenance-plans/preventive-maintenance-plan.repositoty';
import { MaintenanceAlertCommand } from './usecases/maintenance-alerts/maintenance-alert.usecase.command';
import { MaintenanceAlertQuery } from './usecases/maintenance-alerts/maintenance-alert.usecase.query';
import { MaintenanceCommand } from './usecases/maintenances/maintenance.usecase.command';
import { MaintenanceQuery } from './usecases/maintenances/maintenance.usecase.query';
import { PreventiveMaintenancePlanCommand } from './usecases/preventive-maintenance-plans/preventive-maintenance-plan.usecase.command';
import { PreventiveMaintenancePlanQuery } from './usecases/preventive-maintenance-plans/preventive-maintenance-plan.usecase.query';
import { VehicleTypeController } from './controllers/vehicle-type.controller';
import { VehicleController } from './controllers/vehicle.controller';
import { VehicleRepository } from './persistence/vehicles/vehicle.repository';
import { VehicleTypeRepository } from './persistence/vehicle-types/vehicle-type.repository';
import { MaintenanceController } from './controllers/maintenance.controller';
import { PreventiveMaintenancePlanController } from './controllers/preventive-maintenance-alert.controller';
import { MaintenanceAlertController } from './controllers/maintenance-alert.controller';
@Module({
  controllers: [
    VehicleTypeController,
    VehicleController,
    MaintenanceController,
    PreventiveMaintenancePlanController,
    MaintenanceAlertController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      VehicleTypeEntity,
      VehicleEntity,
      MaintenanceEntity,
      PreventiveMaintenancePlanEntity,
      MaintenanceAlertEntity,
    ]),
  ],
  providers: [
    VehicleTypeRepository,
    VehicleTypeCommand,
    VehicleTypeQuery,
    VehicleRepository,
    VehicleCommand,
    VehicleQuery,
    MaintenanceRepository,
    MaintenanceCommand,
    MaintenanceQuery,
    PreventiveMaintenancePlanRepository,
    PreventiveMaintenancePlanCommand,
    PreventiveMaintenancePlanQuery,
    MaintenanceAlertRepository,
    MaintenanceAlertCommand,
    MaintenanceAlertQuery,
  ],
})
export class AssetModule {}
