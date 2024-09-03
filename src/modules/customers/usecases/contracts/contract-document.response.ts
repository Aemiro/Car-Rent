import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '@lib/common/file-dto';
import { ContractResponse } from './contract.response';
import { DocumentTypeResponse } from '@setting/usecases/document-types/document-type.response';
import { ContractDocumentEntity } from '@customer/persistence/contracts/contract-document.entity';

export class ContractDocumentResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  contractId: string;
  @ApiProperty()
  documentTypeId: string;
  @ApiProperty()
  file: FileDto;
  @ApiProperty()
  expirationDate: Date;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;
  @ApiProperty()
  deletedBy: string;
  contract?: ContractResponse;
  documentType?: DocumentTypeResponse;

  static toResponse(entity: ContractDocumentEntity): ContractDocumentResponse {
    const response = new ContractDocumentResponse();
    response.id = entity.id;
    response.contractId = entity.contractId;
    response.documentTypeId = entity.documentTypeId;
    response.expirationDate = entity.expirationDate;
    response.file = entity.file;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.contract) {
      response.contract = ContractResponse.toResponse(entity.contract);
    }
    if (entity.documentType) {
      response.documentType = DocumentTypeResponse.toResponse(
        entity.documentType,
      );
    }
    return response;
  }
}
