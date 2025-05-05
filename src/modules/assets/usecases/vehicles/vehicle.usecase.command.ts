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
import { StripeService } from '@infrastructure/stripe/stripe.service';
@Injectable()
export class VehicleCommand {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly stripeService: StripeService,
  ) {}
  async createVehicle(command: CreateVehicleCommand): Promise<VehicleResponse> {
    if (await this.vehicleRepository.getOneBy('vin', command.vin, [], true)) {
      throw new BadRequestException(`Vehicle already exist with this vin`);
    }
    if (
      await this.vehicleRepository.getOneBy(
        'plateNumber',
        command.plateNumber,
        [],
        true,
      )
    ) {
      throw new BadRequestException(
        `Vehicle already exist with this plate number`,
      );
    }
    const vehicleDomain = CreateVehicleCommand.toEntity(command);
    vehicleDomain.createdBy = command?.currentUser?.id;
    vehicleDomain.updatedBy = command?.currentUser?.id;
    const vehicle = await this.vehicleRepository.insert(vehicleDomain);
    const productName = `${vehicle.make} ${vehicle.model} - ${vehicle.plateNumber}`;
    const stripeProduct = await this.stripeService.createProduct(
      productName,
      productName,
      {
        vehicleId: vehicle.id,
        plateNumber: vehicleDomain.plateNumber,
        engineNumber: vehicleDomain.engineNumber,
        vin: vehicleDomain.vin,
        registrationNumber: vehicleDomain.registrationNumber,
        color: vehicleDomain.color,
        make: vehicleDomain.make,
        model: vehicleDomain.model,
      },
    );
    vehicle.stripeProductId = stripeProduct.id;
    await this.vehicleRepository.save(vehicle);
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
    if (vehicle.plateNumber !== command.plateNumber) {
      const user = await this.vehicleRepository.getOneBy(
        'plateNumber',
        command.plateNumber,
        [],
        true,
      );
      if (user) {
        throw new BadRequestException(
          `Vehicle already exist with this plateNumber`,
        );
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
    vehicle.plateNumber = command.plateNumber;
    vehicle.status = command.status;
    vehicle.updatedBy = command?.currentUser?.id;
    const result = await this.vehicleRepository.save(vehicle);
    const productName = `${vehicle.make} ${vehicle.model} - ${vehicle.plateNumber}`;

    if (vehicle.stripeProductId) {
      await this.stripeService.updateProduct(vehicle.stripeProductId, {
        name: productName,
        description: productName,
        metadata: {
          vehicleId: vehicle.id,
          plateNumber: vehicle.plateNumber,
          engineNumber: vehicle.engineNumber,
          vin: vehicle.vin,
          registrationNumber: vehicle.registrationNumber,
          color: vehicle.color,
          make: vehicle.make,
          model: vehicle.model,
        },
      });
    } else {
      await this.stripeService.createProduct(productName, productName, {
        vehicleId: vehicle.id,
        plateNumber: vehicle.plateNumber,
        engineNumber: vehicle.engineNumber,
        vin: vehicle.vin,
        registrationNumber: vehicle.registrationNumber,
        color: vehicle.color,
        make: vehicle.make,
        model: vehicle.model,
      });
    }
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
