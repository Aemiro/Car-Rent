import { Injectable, NotFoundException } from '@nestjs/common';
import { UserInfo } from '@lib/common/user-info';
import { PreventiveMaintenancePlanRepository } from '@asset/persistence/preventive-maintenance-plans/preventive-maintenance-plan.repositoty';
import {
  CreatePreventiveMaintenancePlanCommand,
  UpdatePreventiveMaintenancePlanCommand,
  ArchivePreventiveMaintenancePlanCommand,
} from './preventive-maintenance-plan.commands';
import { PreventiveMaintenancePlanResponse } from './preventive-maintenance-plan.response';
@Injectable()
export class PreventiveMaintenancePlanCommand {
  constructor(
    private readonly preventiveMaintenancePlanRepository: PreventiveMaintenancePlanRepository,
  ) {}
  async createPreventiveMaintenancePlan(
    command: CreatePreventiveMaintenancePlanCommand,
  ): Promise<PreventiveMaintenancePlanResponse> {
    const preventiveMaintenancePlanDomain =
      CreatePreventiveMaintenancePlanCommand.toEntity(command);
    preventiveMaintenancePlanDomain.createdBy = command?.currentUser?.id;
    preventiveMaintenancePlanDomain.updatedBy = command?.currentUser?.id;
    const preventiveMaintenancePlan =
      await this.preventiveMaintenancePlanRepository.insert(
        preventiveMaintenancePlanDomain,
      );

    return PreventiveMaintenancePlanResponse.toResponse(
      preventiveMaintenancePlan,
    );
  }
  async updatePreventiveMaintenancePlan(
    command: UpdatePreventiveMaintenancePlanCommand,
  ): Promise<PreventiveMaintenancePlanResponse> {
    const preventiveMaintenancePlan =
      await this.preventiveMaintenancePlanRepository.getById(command.id);
    if (!preventiveMaintenancePlan) {
      throw new NotFoundException(
        `PreventiveMaintenancePlan not found with id ${command.id}`,
      );
    }
    preventiveMaintenancePlan.vehicleId = command.vehicleId;
    preventiveMaintenancePlan.maintenanceType = command.maintenanceType;
    preventiveMaintenancePlan.intervalType = command.intervalType;
    preventiveMaintenancePlan.intervalValue = command.intervalValue;
    preventiveMaintenancePlan.updatedBy = command?.currentUser?.id;
    const result = await this.preventiveMaintenancePlanRepository.save(
      preventiveMaintenancePlan,
    );
    return PreventiveMaintenancePlanResponse.toResponse(result);
  }
  async archivePreventiveMaintenancePlan(
    command: ArchivePreventiveMaintenancePlanCommand,
  ): Promise<PreventiveMaintenancePlanResponse> {
    const preventiveMaintenancePlanDomain =
      await this.preventiveMaintenancePlanRepository.getById(command.id);
    if (!preventiveMaintenancePlanDomain) {
      throw new NotFoundException(
        `PreventiveMaintenancePlan not found with id ${command.id}`,
      );
    }
    preventiveMaintenancePlanDomain.deletedAt = new Date();
    preventiveMaintenancePlanDomain.deletedBy = command?.currentUser?.id;
    const result = await this.preventiveMaintenancePlanRepository.save(
      preventiveMaintenancePlanDomain,
    );

    return PreventiveMaintenancePlanResponse.toResponse(result);
  }
  async restorePreventiveMaintenancePlan(
    id: string,
    currentUser: UserInfo,
  ): Promise<PreventiveMaintenancePlanResponse> {
    const preventiveMaintenancePlanDomain =
      await this.preventiveMaintenancePlanRepository.getById(id, [], true);
    if (!preventiveMaintenancePlanDomain) {
      throw new NotFoundException(
        `PreventiveMaintenancePlan not found with id ${id}`,
      );
    }
    await this.preventiveMaintenancePlanRepository.restore(id);
    preventiveMaintenancePlanDomain.deletedAt = null;
    return PreventiveMaintenancePlanResponse.toResponse(
      preventiveMaintenancePlanDomain,
    );
  }
  async deletePreventiveMaintenancePlan(
    id: string,
    currentUser: UserInfo,
  ): Promise<boolean> {
    const preventiveMaintenancePlanDomain =
      await this.preventiveMaintenancePlanRepository.getById(id, [], true);
    if (!preventiveMaintenancePlanDomain) {
      throw new NotFoundException(
        `PreventiveMaintenancePlan not found with id ${id}`,
      );
    }
    const result = await this.preventiveMaintenancePlanRepository.delete(id);
    return result;
  }
}
