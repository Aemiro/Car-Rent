import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaymentEntity } from '../../persistence/payments/payment.entity';
import { UserInfo } from '@lib/common/user-info';

export class CreatePaymentCommand {
  @ApiProperty()
  @IsNotEmpty()
  contractId: string;
  @ApiProperty()
  @IsNotEmpty()
  tenantId: string;
  @ApiProperty()
  @IsNotEmpty()
  vehicleId: string;
  currentUser: UserInfo;

  static toEntity(command: CreatePaymentCommand): PaymentEntity {
    const entity = new PaymentEntity();
    entity.contractId = command.contractId;
    entity.tenantId = command.tenantId;
    entity.vehicleId = command.vehicleId;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdatePaymentCommand extends PartialType(CreatePaymentCommand) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchivePaymentCommand {
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
