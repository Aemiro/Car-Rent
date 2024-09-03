import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { VehicleStatus } from 'modules/assets/enum';
import { VehicleTypeEntity } from '../vehicle-types/vehicle.type.entity';
import { VehicleDocumentEntity } from './vehicle-document.entity';
import { PaymentEntity } from '@customer/persistence/payments/payment.entity';
import { MaintenanceEntity } from '../maintenances/maintenance.entity';
import { PreventiveMaintenancePlanEntity } from '../preventive-maintenance-plans/preventive-maintenance-plan.entity';
import { MaintenanceAlertEntity } from '../maintenance-alerts/maintenance-alert.entity';
import { ContractEntity } from '@customer/persistence/contracts/contract.entity';
@Entity('vehicles')
export class VehicleEntity extends CommonEntity {
  @Column()
  make: string;
  @Column()
  model: string;
  @Column({ type: 'integer' })
  year: number;
  @Column({ name: 'registration_number' })
  registrationNumber: string;
  @Column()
  vin: string;
  @Column({ name: 'engine_number', nullable: true })
  engineNumber: string;
  @Column({ nullable: true })
  color: string;
  @Column({ name: 'vehicle_type_id', nullable: true })
  vehicleTypeId: string;

  @Column({ name: 'monthly_rental_rate' })
  monthlyRentalRate: number;
  @Column({ name: 'weekly_rental_rate' })
  weeklyRentalRate: number;
  @Column({ default: VehicleStatus.AVAILABLE })
  status: string;
  @ManyToOne(() => VehicleTypeEntity, (vehicleType) => vehicleType.vehicles, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_type_id' })
  vehicleType: VehicleTypeEntity;
  @OneToMany(() => PaymentEntity, (payment) => payment.vehicle, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  payments: PaymentEntity[];

  @OneToMany(() => MaintenanceEntity, (maintenance) => maintenance.vehicle, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  maintenances: MaintenanceEntity[];
  @OneToMany(
    () => MaintenanceAlertEntity,
    (maintenanceAlert) => maintenanceAlert.vehicle,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  maintenanceAlerts: MaintenanceAlertEntity[];
  @OneToMany(
    () => PreventiveMaintenancePlanEntity,
    (preventiveMaintenancePlan) => preventiveMaintenancePlan.vehicle,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  preventiveMaintenancePlans: PreventiveMaintenancePlanEntity[];
  @OneToMany(() => ContractEntity, (contract) => contract.vehicle, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  contracts: ContractEntity[];

  @OneToMany(
    () => VehicleDocumentEntity,
    (vehicleDocument) => vehicleDocument.vehicle,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      cascade: true,
    },
  )
  documents: VehicleDocumentEntity[];

  addDocument(document: VehicleDocumentEntity) {
    this.documents.push(document);
  }
  updateDocument(document: VehicleDocumentEntity) {
    const index = this.documents.findIndex((c) => c.id === document.id);
    if (index === -1) return;
    this.documents[index] = document;
  }
  removeDocument(documentId: string) {
    this.documents = this.documents.filter((c) => c.id !== documentId);
  }
  updateDocuments(documents: VehicleDocumentEntity[]) {
    this.documents = documents;
  }
}
