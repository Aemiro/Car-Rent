import { ApiProperty } from '@nestjs/swagger';
import { TenantResponse } from './tenant.response';
import { TenantContactEntity } from '@customer/persistence/tenants/tenant-contact.entity';

export class TenantContactResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  tenantId: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  position: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  note: string;
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
  tenant?: TenantResponse;
  static toResponse(entity: TenantContactEntity): TenantContactResponse {
    const response = new TenantContactResponse();
    response.id = entity.id;
    response.name = entity.name;
    response.email = entity.email;
    response.phone = entity.phone;
    response.position = entity.position;
    response.gender = entity.gender;
    response.note = entity.note;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.tenant) {
      response.tenant = TenantResponse.toResponse(entity.tenant);
    }
    return response;
  }
}
