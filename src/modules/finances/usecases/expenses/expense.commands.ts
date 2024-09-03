import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserInfo } from '@lib/common/user-info';
import { ExpenseEntity } from '@finance/persistence/expenses/expense.entity';
export class CreateExpenseCommand {
  @ApiProperty()
  @IsNotEmpty()
  amount: number;
  @ApiProperty()
  vehicleId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  @IsNotEmpty()
  expenseTypeId: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  expenseDate?: Date;

  currentUser: UserInfo;

  static toEntity(command: CreateExpenseCommand): ExpenseEntity {
    const entity = new ExpenseEntity();
    entity.amount = command.amount;
    entity.expenseTypeId = command.expenseTypeId;
    entity.vehicleId = command.vehicleId;
    entity.userId = command.userId;
    entity.description = command.description;
    entity.expenseDate = command.expenseDate;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateExpenseCommand extends PartialType(CreateExpenseCommand) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchiveExpenseCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
