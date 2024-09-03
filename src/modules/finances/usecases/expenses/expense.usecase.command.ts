import {
  ArchiveExpenseCommand,
  CreateExpenseCommand,
  UpdateExpenseCommand,
} from './expense.commands';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseResponse } from './expense.response';
import { UserInfo } from '@lib/common/user-info';
import { ExpenseRepository } from '@finance/persistence/expenses/expense.repository';

@Injectable()
export class ExpenseCommand {
  constructor(private readonly expenseTypeRepository: ExpenseRepository) {}
  async createExpense(command: CreateExpenseCommand): Promise<ExpenseResponse> {
    const expenseTypeDomain = CreateExpenseCommand.toEntity(command);
    expenseTypeDomain.createdBy = command?.currentUser?.id;
    expenseTypeDomain.updatedBy = command?.currentUser?.id;
    const expenseType =
      await this.expenseTypeRepository.insert(expenseTypeDomain);

    return ExpenseResponse.toResponse(expenseType);
  }
  async updateExpense(command: UpdateExpenseCommand): Promise<ExpenseResponse> {
    const expenseType = await this.expenseTypeRepository.getById(command.id);
    if (!expenseType) {
      throw new NotFoundException(`Expense not found with id ${command.id}`);
    }
    expenseType.amount = command.amount;
    expenseType.expenseTypeId = command.expenseTypeId;
    expenseType.vehicleId = command.vehicleId;
    expenseType.userId = command.userId;

    expenseType.description = command.description;
    expenseType.expenseDate = command?.expenseDate ?? expenseType?.expenseDate;

    expenseType.updatedBy = command?.currentUser?.id;
    const result = await this.expenseTypeRepository.save(expenseType);
    return ExpenseResponse.toResponse(result);
  }
  async archiveExpense(
    command: ArchiveExpenseCommand,
  ): Promise<ExpenseResponse> {
    const expenseTypeDomain = await this.expenseTypeRepository.getById(
      command.id,
    );
    if (!expenseTypeDomain) {
      throw new NotFoundException(`Expense  not found with id ${command.id}`);
    }
    expenseTypeDomain.deletedAt = new Date();
    expenseTypeDomain.deletedBy = command?.currentUser?.id;
    const result = await this.expenseTypeRepository.save(expenseTypeDomain);

    return ExpenseResponse.toResponse(result);
  }
  async restoreExpense(
    id: string,
    currentUser: UserInfo,
  ): Promise<ExpenseResponse> {
    const expenseTypeDomain = await this.expenseTypeRepository.getById(
      id,
      [],
      true,
    );
    if (!expenseTypeDomain) {
      throw new NotFoundException(`Expense  not found with id ${id}`);
    }
    await this.expenseTypeRepository.restore(id);
    expenseTypeDomain.deletedAt = null;
    return ExpenseResponse.toResponse(expenseTypeDomain);
  }
  async deleteExpense(id: string, currentUser: UserInfo): Promise<boolean> {
    const expenseTypeDomain = await this.expenseTypeRepository.getById(
      id,
      [],
      true,
    );
    if (!expenseTypeDomain) {
      throw new NotFoundException(`Expense  not found with id ${id}`);
    }
    const result = await this.expenseTypeRepository.delete(id);
    return result;
  }
}
