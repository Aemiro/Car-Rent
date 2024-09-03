import { VehicleDocumentEntity } from '@asset/persistence/vehicles/vehicle-document.entity';
import { ContractDocumentEntity } from '@customer/persistence/contracts/contract-document.entity';
import { PaymentDocumentEntity } from '@customer/persistence/payments/payment-document.entity';
import { CommonEntity } from '@lib/common/common.entity';
import { UserDocumentEntity } from '@user/persistence/users/user-document.entity';
import { Column, Entity, OneToMany } from 'typeorm';
@Entity('document_types')
export class DocumentTypeEntity extends CommonEntity {
  @Column({ name: 'name' })
  name: string;
  @Column({ type: 'text', nullable: true })
  note: string;
  @Column({ name: 'code' })
  code: string;
  @Column({ name: 'is_contract_document', nullable: true })
  isContractDocument: boolean;
  @Column({ name: 'is_finance_document', nullable: true })
  isFinanceDocument: boolean;
  @Column({ name: 'is_driver_document', nullable: true })
  isDriverDocument: boolean;
  @Column({ name: 'is_vehicle_document', nullable: true })
  isVehicleDocument: boolean;
  @Column({ name: 'has_expiration_date', nullable: true, default: false })
  hasExpirationDate: boolean;
  @OneToMany(
    () => VehicleDocumentEntity,
    (vehicleDocument) => vehicleDocument.documentType,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  vehicleDocuments: VehicleDocumentEntity[];
  @OneToMany(
    () => UserDocumentEntity,
    (userDocument) => userDocument.documentType,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  userDocuments: UserDocumentEntity[];

  @OneToMany(
    () => ContractDocumentEntity,
    (contractDocument) => contractDocument.documentType,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  contractDocuments: ContractDocumentEntity[];

  @OneToMany(
    () => PaymentDocumentEntity,
    (paymentDocument) => paymentDocument.documentType,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  paymentDocuments: PaymentDocumentEntity[];
}
