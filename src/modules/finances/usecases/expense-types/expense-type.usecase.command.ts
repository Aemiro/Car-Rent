import {
  ArchiveExpenseTypeCommand,
  CreateExpenseTypeCommand,
  UpdateExpenseTypeCommand,
} from './expense-type.commands';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ExpenseTypeResponse } from './expense-type.response';
import { UserInfo } from '@lib/common/user-info';
import { ExpenseTypeRepository } from '@finance/persistence/expense-types/expense-type.repository';

@Injectable()
export class ExpenseTypeCommand {
  constructor(private readonly expenseTypeRepository: ExpenseTypeRepository) {}
  async createExpenseType(
    command: CreateExpenseTypeCommand,
  ): Promise<ExpenseTypeResponse> {
    if (
      await this.expenseTypeRepository.getOneBy('name', command.name, [], true)
    ) {
      throw new BadRequestException(
        `Expense type already exist with this name`,
      );
    }
    if (
      await this.expenseTypeRepository.getOneBy('code', command.code, [], true)
    ) {
      throw new BadRequestException(
        `Expense type already exist with this code`,
      );
    }
    const expenseTypeDomain = CreateExpenseTypeCommand.toEntity(command);
    expenseTypeDomain.createdBy = command?.currentUser?.id;
    expenseTypeDomain.updatedBy = command?.currentUser?.id;
    const expenseType =
      await this.expenseTypeRepository.insert(expenseTypeDomain);

    return ExpenseTypeResponse.toResponse(expenseType);
  }
  async updateExpenseType(
    command: UpdateExpenseTypeCommand,
  ): Promise<ExpenseTypeResponse> {
    const expenseType = await this.expenseTypeRepository.getById(command.id);
    if (!expenseType) {
      throw new NotFoundException(
        `Expense type not found with id ${command.id}`,
      );
    }
    if (expenseType.name !== command.name) {
      const user = await this.expenseTypeRepository.getOneBy(
        'name',
        command.name,
        [],
        true,
      );
      if (user) {
        throw new BadRequestException(
          `Expense type already exist with this name`,
        );
      }
    }
    if (expenseType.code !== command.code) {
      const user = await this.expenseTypeRepository.getOneBy(
        'code',
        command.code,
        [],
        true,
      );
      if (user) {
        throw new BadRequestException(
          `Expense type already exist with this code`,
        );
      }
    }
    expenseType.name = command.name;
    expenseType.code = command.code;
    expenseType.description = command.description;
    expenseType.isActive = command?.isActive ?? expenseType?.isActive;

    expenseType.updatedBy = command?.currentUser?.id;
    const result = await this.expenseTypeRepository.save(expenseType);
    return ExpenseTypeResponse.toResponse(result);
  }
  async archiveExpenseType(
    command: ArchiveExpenseTypeCommand,
  ): Promise<ExpenseTypeResponse> {
    const expenseTypeDomain = await this.expenseTypeRepository.getById(
      command.id,
    );
    if (!expenseTypeDomain) {
      throw new NotFoundException(
        `Expense Type not found with id ${command.id}`,
      );
    }
    expenseTypeDomain.deletedAt = new Date();
    expenseTypeDomain.deletedBy = command?.currentUser?.id;
    const result = await this.expenseTypeRepository.save(expenseTypeDomain);

    return ExpenseTypeResponse.toResponse(result);
  }
  async restoreExpenseType(
    id: string,
    currentUser: UserInfo,
  ): Promise<ExpenseTypeResponse> {
    const expenseTypeDomain = await this.expenseTypeRepository.getById(
      id,
      [],
      true,
    );
    if (!expenseTypeDomain) {
      throw new NotFoundException(`Expense Type not found with id ${id}`);
    }
    await this.expenseTypeRepository.restore(id);
    expenseTypeDomain.deletedAt = null;
    return ExpenseTypeResponse.toResponse(expenseTypeDomain);
  }
  async deleteExpenseType(id: string, currentUser: UserInfo): Promise<boolean> {
    const expenseTypeDomain = await this.expenseTypeRepository.getById(
      id,
      [],
      true,
    );
    if (!expenseTypeDomain) {
      throw new NotFoundException(`Expense Type not found with id ${id}`);
    }
    const result = await this.expenseTypeRepository.delete(id);
    return result;
  }
}
