import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ExpenseTypeEntity } from '../expense-types/expense-type.entity';
import { VehicleEntity } from '@asset/persistence/vehicles/vehicle.entity';
import { UserEntity } from '@user/persistence/users/user.entity';

@Entity('expenses')
export class ExpenseEntity extends CommonEntity {
  @Column({ name: 'expense_type_id' })
  expenseTypeId: string;
  @Column({ name: 'vehicle_id' })
  vehicleId: string;
  @Column({ name: 'user_id' })
  userId: string;
  @Column({ name: 'amount' })
  amount: number;
  @Column({ name: 'expense_date', type: 'date' })
  expenseDate: Date;
  @Column({ name: 'status' })
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => ExpenseTypeEntity, (expenseType) => expenseType.expenses, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expense_type_id' })
  expenseType: ExpenseTypeEntity;

  @ManyToOne(() => VehicleEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: VehicleEntity;

  @ManyToOne(() => UserEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
