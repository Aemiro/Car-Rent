import { Address } from '@lib/common/address';
import { CommonEntity } from '@lib/common/common.entity';
import { FileDto } from '@lib/common/file-dto';
import { Column, Entity, OneToMany } from 'typeorm';
import { TenantContactEntity } from './tenant-contact.entity';
import { ContractEntity } from '../contracts/contract.entity';
import { PaymentEntity } from '../payments/payment.entity';
import { TenantDocumentEntity } from './tenant-document.entity';
@Entity('tenants')
export class TenantEntity extends CommonEntity {
  @Column()
  name: string;
  @Column({ type: 'text', nullable: true })
  note: string;
  @Column({ name: 'phone' })
  phone: string;
  @Column({ name: 'email', nullable: true })
  email: string;
  @Column({ nullable: true })
  tin: string;
  @Column({ type: 'jsonb', nullable: true })
  address: Address;
  @Column({ type: 'jsonb', nullable: true })
  logo: FileDto;
  @Column({ nullable: true })
  status: string;
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
  @Column({ nullable: true })
  website: string;

  @OneToMany(() => ContractEntity, (contract) => contract.tenant, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  contracts: ContractEntity[];
  @OneToMany(() => PaymentEntity, (payment) => payment.tenant, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  payments: PaymentEntity[];

  @OneToMany(
    () => TenantDocumentEntity,
    (tenantDocument) => tenantDocument.tenant,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      cascade: true,
    },
  )
  documents: TenantDocumentEntity[];

  addDocument(document: TenantDocumentEntity) {
    this.documents.push(document);
  }
  updateDocument(document: TenantDocumentEntity) {
    const index = this.documents.findIndex((c) => c.id === document.id);
    if (index === -1) return;
    this.documents[index] = document;
  }
  removeDocument(documentId: string) {
    this.documents = this.documents.filter((c) => c.id !== documentId);
  }
  updateDocuments(documents: TenantDocumentEntity[]) {
    this.documents = documents;
  }

  @OneToMany(
    () => TenantContactEntity,
    (tenantContact) => tenantContact.tenant,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      cascade: true,
    },
  )
  contacts: TenantContactEntity[];

  addContact(contact: TenantContactEntity) {
    this.contacts.push(contact);
  }
  updateContact(contact: TenantContactEntity) {
    const index = this.contacts.findIndex((c) => c.id === contact.id);
    if (index === -1) return;
    this.contacts[index] = contact;
  }
  removeContact(contactId: string) {
    this.contacts = this.contacts.filter((c) => c.id !== contactId);
  }
  updateContacts(contacts: TenantContactEntity[]) {
    this.contacts = contacts;
  }
}
