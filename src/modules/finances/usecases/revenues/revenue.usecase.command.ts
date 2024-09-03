import {
  ArchiveRevenueCommand,
  CreateRevenueCommand,
  UpdateRevenueCommand,
} from './revenue.commands';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RevenueResponse } from './revenue.response';
import { UserInfo } from '@lib/common/user-info';
import { RevenueRepository } from '@finance/persistence/revenues/revenue.repository';

@Injectable()
export class RevenueCommand {
  constructor(private readonly expenseTypeRepository: RevenueRepository) {}
  async createRevenue(command: CreateRevenueCommand): Promise<RevenueResponse> {
    const expenseTypeDomain = CreateRevenueCommand.toEntity(command);
    expenseTypeDomain.createdBy = command?.currentUser?.id;
    expenseTypeDomain.updatedBy = command?.currentUser?.id;
    const expenseType =
      await this.expenseTypeRepository.insert(expenseTypeDomain);

    return RevenueResponse.toResponse(expenseType);
  }
  async updateRevenue(command: UpdateRevenueCommand): Promise<RevenueResponse> {
    const expenseType = await this.expenseTypeRepository.getById(command.id);
    if (!expenseType) {
      throw new NotFoundException(
        `Expense type not found with id ${command.id}`,
      );
    }
    expenseType.amount = command.amount;
    expenseType.sourceId = command.sourceId;
    expenseType.description = command.description;
    expenseType.revenueDate = command?.revenueDate ?? expenseType?.revenueDate;

    expenseType.updatedBy = command?.currentUser?.id;
    const result = await this.expenseTypeRepository.save(expenseType);
    return RevenueResponse.toResponse(result);
  }
  async archiveRevenue(
    command: ArchiveRevenueCommand,
  ): Promise<RevenueResponse> {
    const expenseTypeDomain = await this.expenseTypeRepository.getById(
      command.id,
    );
    if (!expenseTypeDomain) {
      throw new NotFoundException(`Revenue  not found with id ${command.id}`);
    }
    expenseTypeDomain.deletedAt = new Date();
    expenseTypeDomain.deletedBy = command?.currentUser?.id;
    const result = await this.expenseTypeRepository.save(expenseTypeDomain);

    return RevenueResponse.toResponse(result);
  }
  async restoreRevenue(
    id: string,
    currentUser: UserInfo,
  ): Promise<RevenueResponse> {
    const expenseTypeDomain = await this.expenseTypeRepository.getById(
      id,
      [],
      true,
    );
    if (!expenseTypeDomain) {
      throw new NotFoundException(`Revenue  not found with id ${id}`);
    }
    await this.expenseTypeRepository.restore(id);
    expenseTypeDomain.deletedAt = null;
    return RevenueResponse.toResponse(expenseTypeDomain);
  }
  async deleteRevenue(id: string, currentUser: UserInfo): Promise<boolean> {
    const expenseTypeDomain = await this.expenseTypeRepository.getById(
      id,
      [],
      true,
    );
    if (!expenseTypeDomain) {
      throw new NotFoundException(`Revenue  not found with id ${id}`);
    }
    const result = await this.expenseTypeRepository.delete(id);
    return result;
  }
}
