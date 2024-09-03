import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { VehicleEntity } from './vehicle.entity';
import { DocumentTypeEntity } from '@setting/persistence/document-types/document.type.entity';
import { FileDto } from '@lib/common/file-dto';
@Entity('vehicle_documents')
export class VehicleDocumentEntity extends CommonEntity {
  @Column({ name: 'vehicle_id' })
  vehicleId: string;
  @Column({ name: 'document_type_id', nullable: true })
  documentTypeId: string;
  @Column({ type: 'jsonb' })
  file: FileDto;
  @Column({ nullable: true, type: 'date' })
  expirationDate: Date;
  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.documents, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: VehicleEntity;

  @ManyToOne(
    () => DocumentTypeEntity,
    (documentType) => documentType.vehicleDocuments,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'document_type_id' })
  documentType: DocumentTypeEntity;
}
