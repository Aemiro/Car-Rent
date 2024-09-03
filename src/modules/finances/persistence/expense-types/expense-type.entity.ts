import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ExpenseEntity } from '../expenses/expense.entity';
@Entity('expense_types')
export class ExpenseTypeEntity extends CommonEntity {
  @Column({ name: 'name' })
  name: string;
  @Column({ name: 'code' })
  code: string;
  @Column({ type: 'text', nullable: true })
  description: string;
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
  @OneToMany(() => ExpenseEntity, (expense) => expense.expenseType, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  expenses: ExpenseEntity[];
}
