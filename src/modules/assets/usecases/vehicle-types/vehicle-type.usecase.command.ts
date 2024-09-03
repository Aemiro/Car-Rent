import {
  ArchiveVehicleTypeCommand,
  CreateVehicleTypeCommand,
  UpdateVehicleTypeCommand,
} from './vehicle-type.commands';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { VehicleTypeResponse } from './vehicle-type.response';
import { UserInfo } from '@lib/common/user-info';
import { VehicleTypeRepository } from '@asset/persistence/vehicle-types/vehicle-type.repository';
@Injectable()
export class VehicleTypeCommand {
  constructor(private readonly vehicleTypeRepository: VehicleTypeRepository) {}
  async createVehicleType(
    command: CreateVehicleTypeCommand,
  ): Promise<VehicleTypeResponse> {
    if (
      await this.vehicleTypeRepository.getOneBy('name', command.name, [], true)
    ) {
      throw new BadRequestException(
        `Vehicle type already exist with this name`,
      );
    }
    const vehicleTypeDomain = CreateVehicleTypeCommand.toEntity(command);
    vehicleTypeDomain.createdBy = command?.currentUser?.id;
    vehicleTypeDomain.updatedBy = command?.currentUser?.id;
    const vehicleType =
      await this.vehicleTypeRepository.insert(vehicleTypeDomain);

    return VehicleTypeResponse.toResponse(vehicleType);
  }
  async updateVehicleType(
    command: UpdateVehicleTypeCommand,
  ): Promise<VehicleTypeResponse> {
    const vehicleType = await this.vehicleTypeRepository.getById(command.id);
    if (!vehicleType) {
      throw new NotFoundException(
        `Vehicle type not found with id ${command.id}`,
      );
    }
    if (vehicleType.name !== command.name) {
      const user = await this.vehicleTypeRepository.getOneBy(
        'name',
        command.name,
        [],
        true,
      );
      if (user) {
        throw new BadRequestException(
          `Vehicle type already exist with this name`,
        );
      }
    }
    vehicleType.name = command.name;
    vehicleType.description = command.description;
    vehicleType.isActive = command?.isActive ?? vehicleType?.isActive;

    vehicleType.updatedBy = command?.currentUser?.id;
    const result = await this.vehicleTypeRepository.save(vehicleType);
    return VehicleTypeResponse.toResponse(result);
  }
  async archiveVehicleType(
    command: ArchiveVehicleTypeCommand,
  ): Promise<VehicleTypeResponse> {
    const vehicleTypeDomain = await this.vehicleTypeRepository.getById(
      command.id,
    );
    if (!vehicleTypeDomain) {
      throw new NotFoundException(`Product not found with id ${command.id}`);
    }
    vehicleTypeDomain.deletedAt = new Date();
    vehicleTypeDomain.deletedBy = command?.currentUser?.id;
    const result = await this.vehicleTypeRepository.save(vehicleTypeDomain);

    return VehicleTypeResponse.toResponse(result);
  }
  async restoreVehicleType(
    id: string,
    currentUser: UserInfo,
  ): Promise<VehicleTypeResponse> {
    const vehicleTypeDomain = await this.vehicleTypeRepository.getById(
      id,
      [],
      true,
    );
    if (!vehicleTypeDomain) {
      throw new NotFoundException(`Product not found with id ${id}`);
    }
    await this.vehicleTypeRepository.restore(id);
    vehicleTypeDomain.deletedAt = null;
    return VehicleTypeResponse.toResponse(vehicleTypeDomain);
  }
  async deleteVehicleType(id: string, currentUser: UserInfo): Promise<boolean> {
    const vehicleTypeDomain = await this.vehicleTypeRepository.getById(
      id,
      [],
      true,
    );
    if (!vehicleTypeDomain) {
      throw new NotFoundException(`Product not found with id ${id}`);
    }
    const result = await this.vehicleTypeRepository.delete(id);
    return result;
  }
}
