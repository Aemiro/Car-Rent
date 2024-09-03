import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { DocumentTypeEntity } from '@setting/persistence/document-types/document.type.entity';
import { FileDto } from '@lib/common/file-dto';
@Entity('payment_documents')
export class PaymentDocumentEntity extends CommonEntity {
  @Column({ name: 'payment_id' })
  paymentId: string;
  @Column({ name: 'document_type_id', nullable: true })
  documentTypeId: string;
  @Column({ type: 'jsonb' })
  file: FileDto;
  @Column({ nullable: true, type: 'date' })
  expirationDate: Date;
  @ManyToOne(() => PaymentEntity, (payment) => payment.documents, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'payment_id' })
  payment: PaymentEntity;

  @ManyToOne(
    () => DocumentTypeEntity,
    (documentType) => documentType.paymentDocuments,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'document_type_id' })
  documentType: DocumentTypeEntity;
}
