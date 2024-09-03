import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { VehicleEntity } from '../vehicles/vehicle.entity';
import { MaintenanceEntity } from '../maintenances/maintenance.entity';
@Entity('maintenance_alerts')
export class MaintenanceAlertEntity extends CommonEntity {
  @Column({ name: 'vehicle_id' })
  vehicleId: string;
  @Column({ name: 'maintenance_id' })
  maintenanceId: string;
  @Column({ name: 'alert_type' })
  alertType: string;
  @Column({ name: 'message', nullable: true, type: 'text' })
  message: string;
  @Column({ name: 'due_date' })
  dueDate: Date;
  @Column()
  status: string;
  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.maintenanceAlerts, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: VehicleEntity;

  @ManyToOne(
    () => MaintenanceEntity,
    (maintenance) => maintenance.maintenanceAlerts,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  @JoinColumn({ name: 'maintenance_id' })
  maintenance: MaintenanceEntity;
}
