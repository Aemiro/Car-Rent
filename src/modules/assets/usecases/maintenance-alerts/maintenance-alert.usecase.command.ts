import { Injectable, NotFoundException } from '@nestjs/common';
import { UserInfo } from '@lib/common/user-info';
import {
  CreateMaintenanceAlertCommand,
  UpdateMaintenanceAlertCommand,
  ArchiveMaintenanceAlertCommand,
} from './maintenance-alert.commands';
import { MaintenanceAlertResponse } from './maintenance-alert.response';
import { MaintenanceAlertRepository } from '@asset/persistence/maintenance-alerts/maintenance-alert.repository';
@Injectable()
export class MaintenanceAlertCommand {
  constructor(
    private readonly maintenanceAlertRepository: MaintenanceAlertRepository,
  ) {}
  async createMaintenanceAlert(
    command: CreateMaintenanceAlertCommand,
  ): Promise<MaintenanceAlertResponse> {
    const maintenanceAlertDomain =
      CreateMaintenanceAlertCommand.toEntity(command);
    maintenanceAlertDomain.createdBy = command?.currentUser?.id;
    maintenanceAlertDomain.updatedBy = command?.currentUser?.id;
    const maintenanceAlert = await this.maintenanceAlertRepository.insert(
      maintenanceAlertDomain,
    );

    return MaintenanceAlertResponse.toResponse(maintenanceAlert);
  }
  async updateMaintenanceAlert(
    command: UpdateMaintenanceAlertCommand,
  ): Promise<MaintenanceAlertResponse> {
    const maintenanceAlert = await this.maintenanceAlertRepository.getById(
      command.id,
    );
    if (!maintenanceAlert) {
      throw new NotFoundException(
        `MaintenanceAlert not found with id ${command.id}`,
      );
    }
    maintenanceAlert.vehicleId = command.vehicleId;
    maintenanceAlert.maintenanceId = command.maintenanceId;
    maintenanceAlert.alertType = command.alertType;
    maintenanceAlert.message = command.message;
    maintenanceAlert.dueDate = command.dueDate;
    maintenanceAlert.status = command.status;

    maintenanceAlert.updatedBy = command?.currentUser?.id;
    const result = await this.maintenanceAlertRepository.save(maintenanceAlert);
    return MaintenanceAlertResponse.toResponse(result);
  }
  async archiveMaintenanceAlert(
    command: ArchiveMaintenanceAlertCommand,
  ): Promise<MaintenanceAlertResponse> {
    const maintenanceAlertDomain =
      await this.maintenanceAlertRepository.getById(command.id);
    if (!maintenanceAlertDomain) {
      throw new NotFoundException(
        `MaintenanceAlert not found with id ${command.id}`,
      );
    }
    maintenanceAlertDomain.deletedAt = new Date();
    maintenanceAlertDomain.deletedBy = command?.currentUser?.id;
    const result = await this.maintenanceAlertRepository.save(
      maintenanceAlertDomain,
    );

    return MaintenanceAlertResponse.toResponse(result);
  }
  async restoreMaintenanceAlert(
    id: string,
    currentUser: UserInfo,
  ): Promise<MaintenanceAlertResponse> {
    const maintenanceAlertDomain =
      await this.maintenanceAlertRepository.getById(id, [], true);
    if (!maintenanceAlertDomain) {
      throw new NotFoundException(`MaintenanceAlert not found with id ${id}`);
    }
    await this.maintenanceAlertRepository.restore(id);
    maintenanceAlertDomain.deletedAt = null;
    return MaintenanceAlertResponse.toResponse(maintenanceAlertDomain);
  }
  async deleteMaintenanceAlert(
    id: string,
    currentUser: UserInfo,
  ): Promise<boolean> {
    const maintenanceAlertDomain =
      await this.maintenanceAlertRepository.getById(id, [], true);
    if (!maintenanceAlertDomain) {
      throw new NotFoundException(`MaintenanceAlert not found with id ${id}`);
    }
    const result = await this.maintenanceAlertRepository.delete(id);
    return result;
  }
}
