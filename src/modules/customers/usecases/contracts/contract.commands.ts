import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ContractEntity } from '../../persistence/contracts/contract.entity';
import { UserInfo } from '@lib/common/user-info';

export class CreateContractCommand {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: string;
  @ApiProperty()
  @IsNotEmpty()
  vehicleId: string;
  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
  @ApiProperty()
  @IsNotEmpty()
  paymentFrequency: string;
  @ApiProperty()
  totalPrice: number;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  @ApiProperty()
  remark: string;
  currentUser: UserInfo;

  static toEntity(command: CreateContractCommand): ContractEntity {
    const entity = new ContractEntity();
    entity.tenantId = command.tenantId;
    entity.vehicleId = command.vehicleId;
    entity.startDate = command.startDate;
    entity.endDate = command.endDate;
    entity.paymentFrequency = command.paymentFrequency;
    entity.totalPrice = command.totalPrice;
    entity.remark = command.remark;
    entity.status = command.status;
    entity.tenantId = command?.currentUser?.tenantId;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateContractCommand extends PartialType(CreateContractCommand) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchiveContractCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
