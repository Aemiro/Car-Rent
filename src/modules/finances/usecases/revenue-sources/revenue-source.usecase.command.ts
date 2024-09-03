import {
  ArchiveRevenueSourceCommand,
  CreateRevenueSourceCommand,
  UpdateRevenueSourceCommand,
} from './revenue-source.commands';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RevenueSourceResponse } from './revenue-source.response';
import { UserInfo } from '@lib/common/user-info';
import { RevenueSourceRepository } from '@finance/persistence/revenue-sources/revenue-source.repository';

@Injectable()
export class RevenueSourceCommand {
  constructor(
    private readonly expenseTypeRepository: RevenueSourceRepository,
  ) {}
  async createRevenueSource(
    command: CreateRevenueSourceCommand,
  ): Promise<RevenueSourceResponse> {
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
    const expenseTypeDomain = CreateRevenueSourceCommand.toEntity(command);
    expenseTypeDomain.createdBy = command?.currentUser?.id;
    expenseTypeDomain.updatedBy = command?.currentUser?.id;
    const expenseType =
      await this.expenseTypeRepository.insert(expenseTypeDomain);

    return RevenueSourceResponse.toResponse(expenseType);
  }
  async updateRevenueSource(
    command: UpdateRevenueSourceCommand,
  ): Promise<RevenueSourceResponse> {
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
    return RevenueSourceResponse.toResponse(result);
  }
  async archiveRevenueSource(
    command: ArchiveRevenueSourceCommand,
  ): Promise<RevenueSourceResponse> {
    const expenseTypeDomain = await this.expenseTypeRepository.getById(
      command.id,
    );
    if (!expenseTypeDomain) {
      throw new NotFoundException(
        `Revenue Source not found with id ${command.id}`,
      );
    }
    expenseTypeDomain.deletedAt = new Date();
    expenseTypeDomain.deletedBy = command?.currentUser?.id;
    const result = await this.expenseTypeRepository.save(expenseTypeDomain);

    return RevenueSourceResponse.toResponse(result);
  }
  async restoreRevenueSource(
    id: string,
    currentUser: UserInfo,
  ): Promise<RevenueSourceResponse> {
    const expenseTypeDomain = await this.expenseTypeRepository.getById(
      id,
      [],
      true,
    );
    if (!expenseTypeDomain) {
      throw new NotFoundException(`Revenue Source not found with id ${id}`);
    }
    await this.expenseTypeRepository.restore(id);
    expenseTypeDomain.deletedAt = null;
    return RevenueSourceResponse.toResponse(expenseTypeDomain);
  }
  async deleteRevenueSource(
    id: string,
    currentUser: UserInfo,
  ): Promise<boolean> {
    const expenseTypeDomain = await this.expenseTypeRepository.getById(
      id,
      [],
      true,
    );
    if (!expenseTypeDomain) {
      throw new NotFoundException(`Revenue Source not found with id ${id}`);
    }
    const result = await this.expenseTypeRepository.delete(id);
    return result;
  }
}
