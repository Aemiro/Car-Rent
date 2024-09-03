import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TenantEntity } from './tenant.entity';
import { DocumentTypeEntity } from '@setting/persistence/document-types/document.type.entity';
import { FileDto } from '@lib/common/file-dto';
@Entity('tenant_documents')
export class TenantDocumentEntity extends CommonEntity {
  @Column({ name: 'tenant_id' })
  tenantId: string;
  @Column({ name: 'document_type_id', nullable: true })
  documentTypeId: string;
  @Column({ type: 'jsonb' })
  file: FileDto;
  @Column({ nullable: true, type: 'date' })
  expirationDate: Date;
  @ManyToOne(() => TenantEntity, (tenant) => tenant.documents, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @ManyToOne(() => DocumentTypeEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_type_id' })
  documentType: DocumentTypeEntity;
}
