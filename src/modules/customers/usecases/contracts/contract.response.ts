import { ApiProperty } from '@nestjs/swagger';
import { ContractEntity } from '../../persistence/contracts/contract.entity';
import { VehicleResponse } from '@asset/usecases/vehicles/vehicle.response';
import { TenantResponse } from '../tenants/tenant.response';

export class ContractResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  tenantId: string;
  @ApiProperty()
  vehicleId: string;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
  @ApiProperty()
  paymentFrequency: string;
  @ApiProperty()
  totalPrice: number;
  @ApiProperty()
  status: string;
  @ApiProperty()
  remark: string;
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
  vehicle?: VehicleResponse;
  tenant?: TenantResponse;

  static toResponse(entity: ContractEntity): ContractResponse {
    const response = new ContractResponse();
    response.id = entity.id;
    response.vehicleId = entity.vehicleId;
    response.tenantId = entity.tenantId;
    response.startDate = entity.startDate;
    response.endDate = entity.endDate;
    response.paymentFrequency = entity.paymentFrequency;
    response.totalPrice = entity.totalPrice;
    response.status = entity.status;
    response.remark = entity.remark;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.vehicle) {
      response.vehicle = VehicleResponse.toResponse(entity.vehicle);
    }
    if (entity.tenant) {
      response.tenant = TenantResponse.toResponse(entity.tenant);
    }
    return response;
  }
}
