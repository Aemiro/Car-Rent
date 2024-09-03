import { ExpenseEntity } from '@finance/persistence/expenses/expense.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseTypeResponse } from '../expense-types/expense-type.response';
import { UserResponse } from '@user/usecases/users/user.response';
import { VehicleResponse } from '@asset/usecases/vehicles/vehicle.response';

export class ExpenseResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  vehicleId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  expenseTypeId: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  expenseDate?: Date;
  @ApiProperty()
  status?: string;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;
  @ApiProperty()
  deletedBy: string;
  expenseType?: ExpenseTypeResponse;
  user?: UserResponse;
  vehicle?: VehicleResponse;
  static toResponse(entity: ExpenseEntity): ExpenseResponse {
    const response = new ExpenseResponse();
    response.id = entity.id;
    response.vehicleId = entity.vehicleId;
    response.userId = entity.userId;
    response.amount = entity.amount;
    response.expenseTypeId = entity.expenseTypeId;
    response.description = entity.description;
    response.expenseDate = entity.expenseDate;
    response.status = entity.status;

    response.status = entity.status;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.vehicle) {
      response.vehicle = VehicleResponse.toResponse(entity.vehicle);
    }
    if (entity.user) {
      response.user = UserResponse.toResponse(entity.user);
    }

    if (entity.expenseType) {
      response.expenseType = ExpenseTypeResponse.toResponse(entity.expenseType);
    }
    return response;
  }
}
