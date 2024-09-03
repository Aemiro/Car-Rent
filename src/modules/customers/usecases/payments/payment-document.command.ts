import { PaymentDocumentEntity } from '@customer/persistence/payments/payment-document.entity';
import { FileDto } from '@lib/common/file-dto';
import { UserInfo } from '@lib/common/user-info';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AddPaymentDocumentCommand {
  @ApiProperty()
  @IsNotEmpty()
  paymentId: string;
  @ApiProperty()
  @IsNotEmpty()
  documentTypeId: string;
  @ApiProperty()
  expirationDate: Date;
  file: FileDto;
  currentUser?: UserInfo;
  static toEntity(command: AddPaymentDocumentCommand): PaymentDocumentEntity {
    const entity = new PaymentDocumentEntity();
    entity.paymentId = command.paymentId;
    entity.documentTypeId = command.documentTypeId;
    entity.expirationDate = command.expirationDate;
    entity.file = command.file;
    entity.updatedBy = command?.currentUser?.id;
    entity.createdBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdatePaymentDocumentCommand extends PartialType(
  AddPaymentDocumentCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}

export class RemovePaymentDocumentCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  paymentId: string;
  currentUser: UserInfo;
}
