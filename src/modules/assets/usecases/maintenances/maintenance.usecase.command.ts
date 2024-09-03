import {
  ArchiveMaintenanceCommand,
  CreateMaintenanceCommand,
  UpdateMaintenanceCommand,
} from './maintenance.commands';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MaintenanceResponse } from './maintenance.response';
import { UserInfo } from '@lib/common/user-info';
import { MaintenanceRepository } from '@asset/persistence/maintenances/maintenance.repositoty';
import {
  AddMaintenanceDocumentCommand,
  UpdateMaintenanceDocumentCommand,
  RemoveMaintenanceDocumentCommand,
} from './maintenance-document.command';
@Injectable()
export class MaintenanceCommand {
  constructor(private readonly maintenanceRepository: MaintenanceRepository) {}
  async createMaintenance(
    command: CreateMaintenanceCommand,
  ): Promise<MaintenanceResponse> {
    const maintenanceDomain = CreateMaintenanceCommand.toEntity(command);
    maintenanceDomain.createdBy = command?.currentUser?.id;
    maintenanceDomain.updatedBy = command?.currentUser?.id;
    const maintenance =
      await this.maintenanceRepository.insert(maintenanceDomain);

    return MaintenanceResponse.toResponse(maintenance);
  }
  async updateMaintenance(
    command: UpdateMaintenanceCommand,
  ): Promise<MaintenanceResponse> {
    const maintenance = await this.maintenanceRepository.getById(command.id);
    if (!maintenance) {
      throw new NotFoundException(
        `Maintenance not found with id ${command.id}`,
      );
    }
    maintenance.vehicleId = command.vehicleId;
    maintenance.maintenanceType = command.maintenanceType;
    maintenance.description = command.description;
    maintenance.scheduledDate = command.scheduledDate;
    maintenance.cost = command.cost;
    maintenance.status = command.status;
    maintenance.updatedBy = command?.currentUser?.id;
    const result = await this.maintenanceRepository.save(maintenance);
    return MaintenanceResponse.toResponse(result);
  }
  async archiveMaintenance(
    command: ArchiveMaintenanceCommand,
  ): Promise<MaintenanceResponse> {
    const maintenanceDomain = await this.maintenanceRepository.getById(
      command.id,
    );
    if (!maintenanceDomain) {
      throw new NotFoundException(
        `Maintenance not found with id ${command.id}`,
      );
    }
    maintenanceDomain.deletedAt = new Date();
    maintenanceDomain.deletedBy = command?.currentUser?.id;
    const result = await this.maintenanceRepository.save(maintenanceDomain);

    return MaintenanceResponse.toResponse(result);
  }
  async restoreMaintenance(
    id: string,
    currentUser: UserInfo,
  ): Promise<MaintenanceResponse> {
    const maintenanceDomain = await this.maintenanceRepository.getById(
      id,
      [],
      true,
    );
    if (!maintenanceDomain) {
      throw new NotFoundException(`Maintenance not found with id ${id}`);
    }
    await this.maintenanceRepository.restore(id);
    maintenanceDomain.deletedAt = null;
    return MaintenanceResponse.toResponse(maintenanceDomain);
  }
  async deleteMaintenance(id: string, currentUser: UserInfo): Promise<boolean> {
    const maintenanceDomain = await this.maintenanceRepository.getById(
      id,
      [],
      true,
    );
    if (!maintenanceDomain) {
      throw new NotFoundException(`Maintenance not found with id ${id}`);
    }
    const result = await this.maintenanceRepository.delete(id);
    return result;
  }
  // documents
  async addDocument(payload: AddMaintenanceDocumentCommand) {
    const maintenance = await this.maintenanceRepository.getById(
      payload.maintenanceId,
      ['documents'],
      true,
    );
    if (!maintenance) throw new NotFoundException('Maintenance not found');
    const documentEntity = AddMaintenanceDocumentCommand.toEntity(payload);
    maintenance.addDocument(documentEntity);
    const updatedMaintenance =
      await this.maintenanceRepository.save(maintenance);
    return MaintenanceResponse.toResponse(updatedMaintenance);
  }
  async updateDocument(payload: UpdateMaintenanceDocumentCommand) {
    const maintenance = await this.maintenanceRepository.getById(
      payload.maintenanceId,
      ['documents'],
      true,
    );
    if (!maintenance) throw new NotFoundException('Maintenance not found');
    let document = maintenance.documents.find(
      (maintenanceDocument) => maintenanceDocument.id === payload.id,
    );
    if (!document) throw new NotFoundException('Document not found');
    document = { ...document, ...payload };
    document.updatedBy = payload?.currentUser?.id;
    maintenance.updateDocument(document);
    const updatedMaintenance =
      await this.maintenanceRepository.save(maintenance);
    return MaintenanceResponse.toResponse(updatedMaintenance);
  }
  async removeDocument(payload: RemoveMaintenanceDocumentCommand) {
    const maintenance = await this.maintenanceRepository.getById(
      payload.maintenanceId,
      ['documents'],
      true,
    );
    if (!maintenance) throw new NotFoundException('Maintenance not found');
    const document = maintenance.documents.find(
      (maintenanceDocument) => maintenanceDocument.id === payload.id,
    );
    if (!document) throw new NotFoundException('Document not found');
    maintenance.removeDocument(document.id);
    const result = await this.maintenanceRepository.save(maintenance);
    return MaintenanceResponse.toResponse(result);
  }
}
