import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { MaintenanceAlertEntity } from '../maintenance-alerts/maintenance-alert.entity';
import { MaintenanceDocumentEntity } from './maintenance-document.entity';
import { VehicleEntity } from '../vehicles/vehicle.entity';
@Entity('maintenances')
export class MaintenanceEntity extends CommonEntity {
  @Column({ name: 'vehicle_id' })
  vehicleId: string;
  @Column({ name: 'maintenance_type' })
  maintenanceType: string;
  @Column()
  description: string;
  @Column({ name: 'scheduled_date' })
  scheduledDate: Date;
  @Column({ name: 'actual_date' })
  actualDate: Date;
  @Column()
  cost: number;
  @Column()
  status: string;
  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.maintenances, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: VehicleEntity;

  @OneToMany(
    () => MaintenanceAlertEntity,
    (maintenanceAlert) => maintenanceAlert.maintenance,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  maintenanceAlerts: MaintenanceAlertEntity[];

  @OneToMany(
    () => MaintenanceDocumentEntity,
    (maintenanceDocument) => maintenanceDocument.maintenance,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      cascade: true,
    },
  )
  documents: MaintenanceDocumentEntity[];

  addDocument(document: MaintenanceDocumentEntity) {
    this.documents.push(document);
  }
  updateDocument(document: MaintenanceDocumentEntity) {
    const index = this.documents.findIndex((c) => c.id === document.id);
    if (index === -1) return;
    this.documents[index] = document;
  }
  removeDocument(documentId: string) {
    this.documents = this.documents.filter((c) => c.id !== documentId);
  }
  updateDocuments(documents: MaintenanceDocumentEntity[]) {
    this.documents = documents;
  }
}
