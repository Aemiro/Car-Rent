import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { VehicleEntity } from '../vehicles/vehicle.entity';
@Entity('vehicle_types')
export class VehicleTypeEntity extends CommonEntity {
  @Column({ name: 'name' })
  name: string;
  @Column({ type: 'text', nullable: true })
  description: string;
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
  @OneToMany(() => VehicleEntity, (vehicle) => vehicle.vehicleType, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  vehicles: VehicleEntity[];
}
