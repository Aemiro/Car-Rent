import {
  ArchiveContractCommand,
  CreateContractCommand,
  UpdateContractCommand,
} from './contract.commands';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractResponse } from './contract.response';
import { ContractRepository } from '../../persistence/contracts/contract.repository';
import { UserInfo } from '@lib/common/user-info';
import {
  AddContractDocumentCommand,
  UpdateContractDocumentCommand,
  RemoveContractDocumentCommand,
} from './contract-document.command';
import { StripeService } from '@infrastructure/stripe/stripe.service';
import { ContractStatus } from '@customer/enums';
import { VehicleRepository } from '@asset/persistence/vehicles/vehicle.repository';
@Injectable()
export class ContractCommand {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly stripeService: StripeService,
  ) {}
  async createContract(
    command: CreateContractCommand,
  ): Promise<ContractResponse> {
    const vehicle = await this.vehicleRepository.getById(command.vehicleId);
    if (!vehicle) {
      throw new NotFoundException('Vehicle Not found');
    }
    const contractDomain = CreateContractCommand.toEntity(command);
    contractDomain.createdBy = command?.currentUser?.id;
    contractDomain.updatedBy = command?.currentUser?.id;
    const contract = await this.contractRepository.insert(contractDomain);

    if (contract.status === ContractStatus.ACTIVE && vehicle.stripeProductId) {
      const priceNickname = this.generatePriceNickname({
        plateNumber: vehicle.plateNumber,
        model: vehicle.model,
        billingPeriod: contract.paymentFrequency,
        amount: contract.price,
      });
      const productPrice = await this.stripeService.createPrice(
        vehicle.stripeProductId,
        contract.price,
        priceNickname,
        {
          contractId: contract.id,
          tenantId: contract.tenantId,
          vehicleId: contract.vehicleId,
          paymentFrequency: contract.paymentFrequency,
        },
      );
      contract.stripePriceId = productPrice.id;
      await this.contractRepository.save(contract);
    }
    return ContractResponse.toResponse(contract);
  }
  async updateContract(
    command: UpdateContractCommand,
  ): Promise<ContractResponse> {
    const contract = await this.contractRepository.getById(command.id);
    if (!contract) {
      throw new NotFoundException(`Contract not found with id ${command.id}`);
    }
    const vehicle = await this.vehicleRepository.getById(command.vehicleId);
    if (!vehicle) {
      throw new NotFoundException('Vehicle Not found');
    }
    contract.vehicleId = command.vehicleId;
    contract.tenantId = command.tenantId;
    contract.startDate = command.startDate;
    contract.endDate = command?.endDate ?? contract?.endDate;
    contract.paymentFrequency = command.paymentFrequency;
    contract.price = command.price;
    contract.status = command.status;
    contract.remark = command.remark;
    contract.updatedBy = command?.currentUser?.id;
    if (
      contract.status !== command.status &&
      command.status === ContractStatus.ACTIVE &&
      vehicle.stripeProductId
    ) {
      const priceNickname = this.generatePriceNickname({
        plateNumber: vehicle.plateNumber,
        model: vehicle.model,
        billingPeriod: contract.paymentFrequency,
        amount: contract.price,
      });
      const productPrice = await this.stripeService.createPrice(
        vehicle.stripeProductId,
        contract.price,
        priceNickname,
        {
          contractId: contract.id,
          tenantId: contract.tenantId,
          vehicleId: contract.vehicleId,
          paymentFrequency: contract.paymentFrequency,
        },
      );
      contract.stripePriceId = productPrice.id;
    } else if (
      contract.status !== command.status &&
      command.status === ContractStatus.CANCELLED &&
      vehicle.stripeProductId &&
      contract.stripePriceId
    ) {
      await this.stripeService.updatePrice(contract.stripePriceId, {
        active: false,
      });
    }
    const result = await this.contractRepository.save(contract);
    return ContractResponse.toResponse(result);
  }
  async archiveContract(
    command: ArchiveContractCommand,
  ): Promise<ContractResponse> {
    const contractDomain = await this.contractRepository.getById(command.id);
    if (!contractDomain) {
      throw new NotFoundException(`Contract not found with id ${command.id}`);
    }
    contractDomain.deletedAt = new Date();
    contractDomain.deletedBy = command?.currentUser?.id;
    const result = await this.contractRepository.save(contractDomain);

    return ContractResponse.toResponse(result);
  }
  async restoreContract(
    id: string,
    currentUser: UserInfo,
  ): Promise<ContractResponse> {
    const contractDomain = await this.contractRepository.getById(id, [], true);
    if (!contractDomain) {
      throw new NotFoundException(`Contract not found with id ${id}`);
    }
    await this.contractRepository.restore(id);
    contractDomain.deletedAt = null;
    return ContractResponse.toResponse(contractDomain);
  }
  async deleteContract(id: string, currentUser: UserInfo): Promise<boolean> {
    const contractDomain = await this.contractRepository.getById(id, [], true);
    if (!contractDomain) {
      throw new NotFoundException(`Contract not found with id ${id}`);
    }
    const result = await this.contractRepository.delete(id);
    return result;
  }
  // documents
  async addDocument(payload: AddContractDocumentCommand) {
    const contract = await this.contractRepository.getById(
      payload.contractId,
      ['documents'],
      true,
    );
    if (!contract) throw new NotFoundException('User not found');
    const documentEntity = AddContractDocumentCommand.toEntity(payload);
    contract.addDocument(documentEntity);
    const updatedUser = await this.contractRepository.save(contract);
    return ContractResponse.toResponse(updatedUser);
  }
  async updateDocument(payload: UpdateContractDocumentCommand) {
    const contract = await this.contractRepository.getById(
      payload.contractId,
      ['documents'],
      true,
    );
    if (!contract) throw new NotFoundException('User not found');
    let document = contract.documents.find(
      (contractDocument) => contractDocument.id === payload.id,
    );
    if (!document) throw new NotFoundException('Document not found');
    document = { ...document, ...payload };
    document.updatedBy = payload?.currentUser?.id;
    contract.updateDocument(document);
    const updatedUser = await this.contractRepository.save(contract);
    return ContractResponse.toResponse(updatedUser);
  }
  async removeDocument(payload: RemoveContractDocumentCommand) {
    const contract = await this.contractRepository.getById(
      payload.contractId,
      ['documents'],
      true,
    );
    if (!contract) throw new NotFoundException('Vehicle not found');
    const document = contract.documents.find(
      (contractDocument) => contractDocument.id === payload.id,
    );
    if (!document) throw new NotFoundException('Document not found');
    contract.removeDocument(document.id);
    const result = await this.contractRepository.save(contract);
    return ContractResponse.toResponse(result);
  }
  private generatePriceNickname({
    plateNumber,
    model,
    billingPeriod,
    amount,
    currency = 'PLN',
  }: {
    plateNumber: string;
    model: string;
    billingPeriod: string;
    amount: number;
    currency?: string;
  }) {
    const cleanModel = model.replace(/\s+/g, '-').toLowerCase();
    return `${plateNumber}-${cleanModel}-${billingPeriod}-${amount}${currency.toUpperCase()}`;
  }
}
