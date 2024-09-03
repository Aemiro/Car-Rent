import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { PaymentDocumentEntity } from './payment-document.entity';
import { ContractEntity } from '../contracts/contract.entity';
import { TenantEntity } from '../tenants/tenant.entity';
import { VehicleEntity } from '@asset/persistence/vehicles/vehicle.entity';
@Entity('payments')
export class PaymentEntity extends CommonEntity {
  @Column({ name: 'contract_id' })
  contractId: string;
  @Column({ name: 'tenant_id' })
  tenantId: string;
  @Column({ name: 'vehicle_id' })
  vehicleId: string;
  @Column()
  amount: number;
  @Column({ name: 'payment_method' })
  paymentMethod: string;
  @Column({ name: 'payment_status' })
  paymentStatus: string;
  @Column({ name: 'due_date' })
  dueDate: Date;
  @Column({ name: 'payment_date' })
  paymentDate: Date;
  @Column({ name: 'payment_reference', nullable: true })
  paymentReference: string;

  @OneToMany(() => ContractEntity, (contract) => contract.payments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  contract: ContractEntity;
  @OneToMany(() => TenantEntity, (tenant) => tenant.payments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @OneToMany(() => VehicleEntity, (vehicle) => vehicle.payments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: VehicleEntity;

  @OneToMany(
    () => PaymentDocumentEntity,
    (paymentDocument) => paymentDocument.payment,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      cascade: true,
    },
  )
  documents: PaymentDocumentEntity[];

  addDocument(document: PaymentDocumentEntity) {
    this.documents.push(document);
  }
  updateDocument(document: PaymentDocumentEntity) {
    const index = this.documents.findIndex((c) => c.id === document.id);
    if (index === -1) return;
    this.documents[index] = document;
  }
  removeDocument(documentId: string) {
    this.documents = this.documents.filter((c) => c.id !== documentId);
  }
  updateDocuments(documents: PaymentDocumentEntity[]) {
    this.documents = documents;
  }
}
