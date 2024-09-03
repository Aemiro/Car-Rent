import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ContractEntity } from './contract.entity';
import { DocumentTypeEntity } from '@setting/persistence/document-types/document.type.entity';
import { FileDto } from '@lib/common/file-dto';
@Entity('contract_documents')
export class ContractDocumentEntity extends CommonEntity {
  @Column({ name: 'contract_id' })
  contractId: string;
  @Column({ name: 'document_type_id', nullable: true })
  documentTypeId: string;
  @Column({ type: 'jsonb' })
  file: FileDto;
  @Column({ nullable: true, type: 'date' })
  expirationDate: Date;
  @ManyToOne(() => ContractEntity, (contract) => contract.documents, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'contract_id' })
  contract: ContractEntity;

  @ManyToOne(
    () => DocumentTypeEntity,
    (documentType) => documentType.contractDocuments,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'document_type_id' })
  documentType: DocumentTypeEntity;
}
