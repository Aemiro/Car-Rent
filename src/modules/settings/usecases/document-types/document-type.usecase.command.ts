import {
  ArchiveDocumentTypeCommand,
  CreateDocumentTypeCommand,
  UpdateDocumentTypeCommand,
} from './document-type.commands';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DocumentTypeResponse } from './document-type.response';
import { UserInfo } from '@lib/common/user-info';
import { DocumentTypeRepository } from '@setting/persistence/document-types/document-type.repository';
@Injectable()
export class DocumentTypeCommand {
  constructor(
    private readonly documentTypeRepository: DocumentTypeRepository,
  ) {}
  async createDocumentType(
    command: CreateDocumentTypeCommand,
  ): Promise<DocumentTypeResponse> {
    if (
      await this.documentTypeRepository.getOneBy('name', command.name, [], true)
    ) {
      throw new BadRequestException(
        `Document type already exist with this name`,
      );
    }
    if (
      await this.documentTypeRepository.getOneBy('code', command.code, [], true)
    ) {
      throw new BadRequestException(
        `Document type already exist with this code`,
      );
    }
    const documentTypeDomain = CreateDocumentTypeCommand.toEntity(command);
    documentTypeDomain.createdBy = command?.currentUser?.id;
    documentTypeDomain.updatedBy = command?.currentUser?.id;
    const documentType =
      await this.documentTypeRepository.insert(documentTypeDomain);

    return DocumentTypeResponse.toResponse(documentType);
  }
  async updateDocumentType(
    command: UpdateDocumentTypeCommand,
  ): Promise<DocumentTypeResponse> {
    const documentType = await this.documentTypeRepository.getById(command.id);
    if (!documentType) {
      throw new NotFoundException(`Product not found with id ${command.id}`);
    }
    if (documentType.name !== command.name) {
      const user = await this.documentTypeRepository.getOneBy(
        'name',
        command.name,
        [],
        true,
      );
      if (user) {
        throw new BadRequestException(`Product already exist with this name`);
      }
    }
    if (documentType.code !== command.code) {
      const user = await this.documentTypeRepository.getOneBy(
        'code',
        command.code,
        [],
        true,
      );
      if (user) {
        throw new BadRequestException(`Product already exist with this code`);
      }
    }
    documentType.name = command.name;
    documentType.code = command.code;
    documentType.note = command.note;
    documentType.isContractDocument =
      command?.isContractDocument ?? documentType?.isContractDocument;
    documentType.isVehicleDocument =
      command?.isVehicleDocument ?? documentType?.isVehicleDocument;
    documentType.isDriverDocument =
      command?.isDriverDocument ?? documentType?.isDriverDocument;
    documentType.isFinanceDocument =
      command?.isFinanceDocument ?? documentType?.isContractDocument;
    documentType.hasExpirationDate =
      command?.hasExpirationDate ?? documentType?.hasExpirationDate;

    documentType.updatedBy = command?.currentUser?.id;
    const result = await this.documentTypeRepository.save(documentType);
    return DocumentTypeResponse.toResponse(result);
  }
  async archiveDocumentType(
    command: ArchiveDocumentTypeCommand,
  ): Promise<DocumentTypeResponse> {
    const documentTypeDomain = await this.documentTypeRepository.getById(
      command.id,
    );
    if (!documentTypeDomain) {
      throw new NotFoundException(`Product not found with id ${command.id}`);
    }
    documentTypeDomain.deletedAt = new Date();
    documentTypeDomain.deletedBy = command?.currentUser?.id;
    const result = await this.documentTypeRepository.save(documentTypeDomain);

    return DocumentTypeResponse.toResponse(result);
  }
  async restoreDocumentType(
    id: string,
    currentUser: UserInfo,
  ): Promise<DocumentTypeResponse> {
    const documentTypeDomain = await this.documentTypeRepository.getById(
      id,
      [],
      true,
    );
    if (!documentTypeDomain) {
      throw new NotFoundException(`Product not found with id ${id}`);
    }
    await this.documentTypeRepository.restore(id);
    documentTypeDomain.deletedAt = null;
    return DocumentTypeResponse.toResponse(documentTypeDomain);
  }
  async deleteDocumentType(
    id: string,
    currentUser: UserInfo,
  ): Promise<boolean> {
    const documentTypeDomain = await this.documentTypeRepository.getById(
      id,
      [],
      true,
    );
    if (!documentTypeDomain) {
      throw new NotFoundException(`Product not found with id ${id}`);
    }
    const result = await this.documentTypeRepository.delete(id);
    return result;
  }
}
