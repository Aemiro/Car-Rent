import { Address } from '@lib/common/address';
import { CommonEntity } from '@lib/common/common.entity';
import { FileDto } from '@lib/common/file-dto';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserDocumentEntity } from './user-document.entity';
@Entity('users')
export class UserEntity extends CommonEntity {
  @Column({ name: 'first_name' })
  firstName: string;
  @Column({ name: 'middle_name' })
  middleName: string;
  @Column({ name: 'last_name', nullable: true })
  lastName: string;
  @Column({ nullable: true })
  email: string;
  @Column()
  phone: string;
  @Column({ name: 'job_title', nullable: true })
  jobTitle: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ name: 'profile_picture', nullable: true, type: 'jsonb' })
  profilePicture: FileDto;
  @Column({ name: 'is_active', nullable: true, default: true })
  isActive: boolean;
  @Column({ nullable: true, type: 'jsonb' })
  address: Address;
  @OneToMany(() => UserDocumentEntity, (userDocument) => userDocument.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  documents: UserDocumentEntity[];

  addDocument(document: UserDocumentEntity) {
    this.documents.push(document);
  }
  updateDocument(document: UserDocumentEntity) {
    const index = this.documents.findIndex((c) => c.id === document.id);
    if (index === -1) return;
    this.documents[index] = document;
  }
  removeDocument(documentId: string) {
    this.documents = this.documents.filter((c) => c.id !== documentId);
  }
  updateDocuments(documents: UserDocumentEntity[]) {
    this.documents = documents;
  }
}
