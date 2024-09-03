import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { VehicleEntity } from '../vehicles/vehicle.entity';
@Entity('preventive_maintenance_plans')
export class PreventiveMaintenancePlanEntity extends CommonEntity {
  @Column({ name: 'vehicle_id' })
  vehicleId: string;
  @Column({ name: 'maintenance_type'})
  maintenanceType: string;
  @Column({ name: 'interval_type' })
  intervalType: string;
  @Column({ name: 'interval_value' })
  intervalValue: number;
  @Column({ name: 'last_performed_date' })
  lastPerformedDate: Date;
  @Column({ name: 'next_due_date' })
  nextDueDate: Date;
  @Column({ name: 'last_performed_mileage' })
  lastPerformedMileage: number;
  @Column({ name: 'next_due_mileage' })
  nextDueMileage: number;
  @Column()
  status: string;
  @ManyToOne(
    () => VehicleEntity,
    (vehicle) => vehicle.preventiveMaintenancePlans,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: VehicleEntity;
}
