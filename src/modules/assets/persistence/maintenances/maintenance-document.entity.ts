import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MaintenanceEntity } from './maintenance.entity';
import { DocumentTypeEntity } from '@setting/persistence/document-types/document.type.entity';
import { FileDto } from '@lib/common/file-dto';
@Entity('maintenance_documents')
export class MaintenanceDocumentEntity extends CommonEntity {
  @Column({ name: 'maintenance_id' })
  maintenanceId: string;
  @Column({ name: 'document_type_id', nullable: true })
  documentTypeId: string;
  @Column({ type: 'jsonb' })
  file: FileDto;
  @ManyToOne(() => MaintenanceEntity, (maintenance) => maintenance.documents, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'maintenance_id' })
  maintenance: MaintenanceEntity;

  @ManyToOne(() => DocumentTypeEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_type_id' })
  documentType: DocumentTypeEntity;
}
