import {
  ArchiveVehicleCommand,
  CreateVehicleCommand,
  UpdateVehicleCommand,
} from './vehicle.commands';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { VehicleResponse } from './vehicle.response';
import { UserInfo } from '@lib/common/user-info';
import { VehicleRepository } from '@asset/persistence/vehicles/vehicle.repository';
import {
  AddVehicleDocumentCommand,
  RemoveVehicleDocumentCommand,
  UpdateVehicleDocumentCommand,
} from './vehicle-document.command';
@Injectable()
export class VehicleCommand {
  constructor(private readonly vehicleRepository: VehicleRepository) {}
  async createVehicle(command: CreateVehicleCommand): Promise<VehicleResponse> {
    if (await this.vehicleRepository.getOneBy('vin', command.vin, [], true)) {
      throw new BadRequestException(`Vehicle already exist with this vin`);
    }
    const vehicleDomain = CreateVehicleCommand.toEntity(command);
    vehicleDomain.createdBy = command?.currentUser?.id;
    vehicleDomain.updatedBy = command?.currentUser?.id;
    const vehicle = await this.vehicleRepository.insert(vehicleDomain);

    return VehicleResponse.toResponse(vehicle);
  }
  async updateVehicle(command: UpdateVehicleCommand): Promise<VehicleResponse> {
    const vehicle = await this.vehicleRepository.getById(command.id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle not found with id ${command.id}`);
    }
    if (vehicle.vin !== command.vin) {
      const user = await this.vehicleRepository.getOneBy(
        'vin',
        command.vin,
        [],
        true,
      );
      if (user) {
        throw new BadRequestException(`Vehicle already exist with this vin`);
      }
    }
    vehicle.vin = command.vin;
    vehicle.make = command.make;
    vehicle.model = command.model;
    vehicle.year = command.year;
    vehicle.registrationNumber = command.registrationNumber;
    vehicle.engineNumber = command.engineNumber;
    vehicle.color = command.color;
    vehicle.vehicleTypeId = command.vehicleTypeId;
    vehicle.monthlyRentalRate = command.monthlyRentalRate;
    vehicle.weeklyRentalRate = command.weeklyRentalRate;
    vehicle.status = command.status;
    vehicle.updatedBy = command?.currentUser?.id;
    const result = await this.vehicleRepository.save(vehicle);
    return VehicleResponse.toResponse(result);
  }
  async archiveVehicle(
    command: ArchiveVehicleCommand,
  ): Promise<VehicleResponse> {
    const vehicleDomain = await this.vehicleRepository.getById(command.id);
    if (!vehicleDomain) {
      throw new NotFoundException(`Vehicle not found with id ${command.id}`);
    }
    vehicleDomain.deletedAt = new Date();
    vehicleDomain.deletedBy = command?.currentUser?.id;
    const result = await this.vehicleRepository.save(vehicleDomain);

    return VehicleResponse.toResponse(result);
  }
  async restoreVehicle(
    id: string,
    currentUser: UserInfo,
  ): Promise<VehicleResponse> {
    const vehicleDomain = await this.vehicleRepository.getById(id, [], true);
    if (!vehicleDomain) {
      throw new NotFoundException(`Vehicle not found with id ${id}`);
    }
    await this.vehicleRepository.restore(id);
    vehicleDomain.deletedAt = null;
    return VehicleResponse.toResponse(vehicleDomain);
  }
  async deleteVehicle(id: string, currentUser: UserInfo): Promise<boolean> {
    const vehicleDomain = await this.vehicleRepository.getById(id, [], true);
    if (!vehicleDomain) {
      throw new NotFoundException(`Vehicle not found with id ${id}`);
    }
    const result = await this.vehicleRepository.delete(id);
    return result;
  }
  // documents
  async addDocument(payload: AddVehicleDocumentCommand) {
    const vehicle = await this.vehicleRepository.getById(
      payload.vehicleId,
      ['documents'],
      true,
    );
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    const documentEntity = AddVehicleDocumentCommand.toEntity(payload);
    vehicle.addDocument(documentEntity);
    const updatedVehicle = await this.vehicleRepository.save(vehicle);
    return VehicleResponse.toResponse(updatedVehicle);
  }
  async updateDocument(payload: UpdateVehicleDocumentCommand) {
    const vehicle = await this.vehicleRepository.getById(
      payload.vehicleId,
      ['documents'],
      true,
    );
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    let document = vehicle.documents.find(
      (vehicleDocument) => vehicleDocument.id === payload.id,
    );
    if (!document) throw new NotFoundException('Document not found');
    document = { ...document, ...payload };
    document.updatedBy = payload?.currentUser?.id;
    vehicle.updateDocument(document);
    const updatedVehicle = await this.vehicleRepository.save(vehicle);
    return VehicleResponse.toResponse(updatedVehicle);
  }
  async removeDocument(payload: RemoveVehicleDocumentCommand) {
    const vehicle = await this.vehicleRepository.getById(
      payload.vehicleId,
      ['documents'],
      true,
    );
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    const document = vehicle.documents.find(
      (vehicleDocument) => vehicleDocument.id === payload.id,
    );
    if (!document) throw new NotFoundException('Document not found');
    vehicle.removeDocument(document.id);
    const result = await this.vehicleRepository.save(vehicle);
    return VehicleResponse.toResponse(result);
  }
}
