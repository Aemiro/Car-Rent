import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '@lib/common/file-dto';
import { PaymentResponse } from './payment.response';
import { DocumentTypeResponse } from '@setting/usecases/document-types/document-type.response';
import { PaymentDocumentEntity } from '@customer/persistence/payments/payment-document.entity';

export class PaymentDocumentResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  paymentId: string;
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
  payment?: PaymentResponse;
  documentType?: DocumentTypeResponse;

  static toResponse(entity: PaymentDocumentEntity): PaymentDocumentResponse {
    const response = new PaymentDocumentResponse();
    response.id = entity.id;
    response.paymentId = entity.paymentId;
    response.documentTypeId = entity.documentTypeId;
    response.expirationDate = entity.expirationDate;
    response.file = entity.file;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.payment) {
      response.payment = PaymentResponse.toResponse(entity.payment);
    }
    if (entity.documentType) {
      response.documentType = DocumentTypeResponse.toResponse(
        entity.documentType,
      );
    }
    return response;
  }
}
