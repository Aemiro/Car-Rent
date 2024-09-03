import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { DocumentTypeEntity } from '@setting/persistence/document-types/document.type.entity';
import { FileDto } from '@lib/common/file-dto';
@Entity('user_documents')
export class UserDocumentEntity extends CommonEntity {
  @Column({ name: 'user_id' })
  userId: string;
  @Column({ name: 'document_type_id', nullable: true })
  documentTypeId: string;
  @Column({ type: 'jsonb' })
  file: FileDto;
  @Column({ nullable: true, type: 'date' })
  expirationDate: Date;
  @ManyToOne(() => UserEntity, (user) => user.documents, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(
    () => DocumentTypeEntity,
    (documentType) => documentType.userDocuments,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'document_type_id' })
  documentType: DocumentTypeEntity;
}
