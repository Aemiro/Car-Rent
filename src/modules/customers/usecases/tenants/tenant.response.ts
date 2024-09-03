import { ApiProperty } from '@nestjs/swagger';
import { TenantEntity } from '../../persistence/tenants/tenant.entity';
import { FileDto } from '@lib/common/file-dto';
import { Address } from '@lib/common/address';
import { ContractResponse } from '../contracts/contract.response';
import { TenantContactResponse } from './tenant-contact.response';
import { TenantDocumentResponse } from './tenant-document.response';

export class TenantResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  tin: string;
  @ApiProperty()
  address: Address;
  @ApiProperty()
  note: string;
  @ApiProperty()
  logo: FileDto;
  @ApiProperty()
  website: string;
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
  contacts?: TenantContactResponse[];
  contracts?: ContractResponse[];
  documents?: TenantDocumentResponse[];

  static toResponse(entity: TenantEntity): TenantResponse {
    const response = new TenantResponse();
    response.id = entity.id;
    response.name = entity.name;
    response.email = entity.email;
    response.phone = entity.phone;
    response.tin = entity.tin;
    response.address = entity.address;
    response.note = entity.note;
    response.logo = entity.logo;
    response.website = entity.website;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.contracts) {
      response.contracts = entity.contracts.map((contract) =>
        ContractResponse.toResponse(contract),
      );
    }
    if (entity.contacts) {
      response.contacts = entity.contacts.map((contact) =>
        TenantContactResponse.toResponse(contact),
      );
    }
    if (entity.documents) {
      response.documents = entity.documents.map((document) =>
        TenantDocumentResponse.toResponse(document),
      );
    }
    return response;
  }
}
