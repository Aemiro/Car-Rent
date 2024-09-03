import { ApiProperty } from '@nestjs/swagger';
import { PaymentEntity } from '../../persistence/payments/payment.entity';
import { VehicleResponse } from '@asset/usecases/vehicles/vehicle.response';
import { TenantResponse } from '../tenants/tenant.response';
import { ContractResponse } from '../contracts/contract.response';

export class PaymentResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  contractId: string;
  @ApiProperty()
  tenantId: string;
  @ApiProperty()
  vehicleId: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  paymentDate: Date;
  @ApiProperty()
  paymentStatus: string;
  @ApiProperty()
  dueDate: Date;
  @ApiProperty()
  paymentReference: string;
  @ApiProperty()
  paymentMethod: string;

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
  contract?: ContractResponse;

  static toResponse(entity: PaymentEntity): PaymentResponse {
    const response = new PaymentResponse();
    response.id = entity.id;
    response.contractId = entity.contractId;
    response.tenantId = entity.tenantId;
    response.vehicleId = entity.vehicleId;
    response.amount = entity.amount;
    response.paymentDate = entity.paymentDate;
    response.paymentStatus = entity.paymentStatus;
    response.dueDate = entity.dueDate;
    response.paymentReference = entity.paymentReference;
    response.paymentMethod = entity.paymentMethod;
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
    if (entity.contract) {
      response.contract = ContractResponse.toResponse(entity.contract);
    }
    return response;
  }
}
