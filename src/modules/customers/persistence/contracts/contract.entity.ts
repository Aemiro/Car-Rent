import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TenantEntity } from '../tenants/tenant.entity';
import { ContractDocumentEntity } from './contract-document.entity';
import { PaymentEntity } from '../../../finances/persistence/payments/payment.entity';
import { VehicleEntity } from '@asset/persistence/vehicles/vehicle.entity';
import { ContractStatus, PaymentFrequencyType } from '@customer/enums';
@Entity('contracts')
export class ContractEntity extends CommonEntity {
  @Column({ name: 'tenant_id' })
  tenantId: string;
  @Column({ name: 'vehicle_id' })
  vehicleId: string;
  @Column({ type: 'date', nullable: true })
  startDate: Date;
  @Column({ type: 'date' })
  endDate: Date;
  @Column({ name: 'payment_frequency', default: PaymentFrequencyType.WEEKLY })
  paymentFrequency: string;
  @Column({ name: 'price' })
  price: number;
  @Column({ name: 'status', default: ContractStatus.PENDING })
  status: string;
  @Column({ name: 'remark', nullable: true, type: 'text' })
  remark: string;
  @Column({ nullable: true, name: 'stripe_price_id' })
  stripePriceId: string;
  @ManyToOne(() => TenantEntity, (tenant) => tenant.contracts, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;
  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.contracts, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: VehicleEntity;

  @OneToMany(() => PaymentEntity, (payment) => payment.contract, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  payments: PaymentEntity[];
  @OneToMany(
    () => ContractDocumentEntity,
    (contractDocument) => contractDocument.contract,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      cascade: true,
    },
  )
  documents: ContractDocumentEntity[];

  addDocument(document: ContractDocumentEntity) {
    this.documents.push(document);
  }
  updateDocument(document: ContractDocumentEntity) {
    const index = this.documents.findIndex((c) => c.id === document.id);
    if (index === -1) return;
    this.documents[index] = document;
  }
  removeDocument(documentId: string) {
    this.documents = this.documents.filter((c) => c.id !== documentId);
  }
  updateDocuments(documents: ContractDocumentEntity[]) {
    this.documents = documents;
  }
}
