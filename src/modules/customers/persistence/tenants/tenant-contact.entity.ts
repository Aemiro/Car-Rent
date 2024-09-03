import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TenantEntity } from './tenant.entity';

@Entity('tenant_contacts')
export class TenantContactEntity extends CommonEntity {
  @Column({ name: 'tenant_id' })
  tenantId: string;
  @Column()
  name: string;
  @Column({ name: 'phone' })
  phone: string;
  @Column({ name: 'email', nullable: true })
  email: string;
  @Column({ name: 'position', nullable: true })
  position: string;
  @Column({ name: 'note', nullable: true })
  note: string;
  @Column({ name: 'gender', nullable: true })
  gender: string;
  @ManyToOne(() => TenantEntity, (tenant) => tenant.contacts, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;
}
