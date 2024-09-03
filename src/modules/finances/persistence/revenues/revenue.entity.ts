import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RevenueSourceEntity } from '../revenue-sources/revenue-source.entity';
@Entity('revenues')
export class RevenueEntity extends CommonEntity {
  @Column({ name: 'amount' })
  amount: number;
  @Column({ type: 'text', nullable: true })
  description: string;
  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'revenue_date', type: 'date' })
  revenueDate: Date;
  @Column({ name: 'source_id' })
  sourceId: string;

  @ManyToOne(() => RevenueSourceEntity, (source) => source.revenues, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'source_id' })
  source: RevenueSourceEntity;
}
