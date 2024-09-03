import {
  ArchiveContractCommand,
  CreateContractCommand,
  UpdateContractCommand,
} from './contract.commands';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ContractResponse } from './contract.response';
import { ContractRepository } from '../../persistence/contracts/contract.repository';
import { UserInfo } from '@lib/common/user-info';
import {
  AddContractDocumentCommand,
  UpdateContractDocumentCommand,
  RemoveContractDocumentCommand,
} from './contract-document.command';
@Injectable()
export class ContractCommand {
  constructor(private readonly contractRepository: ContractRepository) {}
  async createContract(
    command: CreateContractCommand,
  ): Promise<ContractResponse> {
    const contractDomain = CreateContractCommand.toEntity(command);
    contractDomain.createdBy = command?.currentUser?.id;
    contractDomain.updatedBy = command?.currentUser?.id;
    const contract = await this.contractRepository.insert(contractDomain);

    return ContractResponse.toResponse(contract);
  }
  async updateContract(
    command: UpdateContractCommand,
  ): Promise<ContractResponse> {
    const contract = await this.contractRepository.getById(command.id);
    if (!contract) {
      throw new NotFoundException(`Contract not found with id ${command.id}`);
    }
    contract.vehicleId = command.vehicleId;
    contract.tenantId = command.tenantId;
    contract.startDate = command.startDate;
    contract.endDate = command?.endDate ?? contract?.endDate;
    contract.paymentFrequency = command.paymentFrequency;
    contract.totalPrice = command.totalPrice;
    contract.status = command.status;
    contract.remark = command.remark;
    contract.updatedBy = command?.currentUser?.id;
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
}
