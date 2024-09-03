import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RevenueEntity } from '../revenues/revenue.entity';
@Entity('revenue_sources')
export class RevenueSourceEntity extends CommonEntity {
  @Column({ name: 'name' })
  name: string;
  @Column({ name: 'code' })
  code: string;
  @Column({ type: 'text', nullable: true })
  description: string;
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => RevenueEntity, (revenue) => revenue.source, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  revenues: RevenueEntity[];
}
