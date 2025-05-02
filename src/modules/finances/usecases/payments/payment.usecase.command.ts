import {
  ArchivePaymentCommand,
  CreatePaymentCommand,
  UpdatePaymentCommand,
} from './payment.commands';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PaymentResponse } from './payment.response';
import { PaymentRepository } from '../../persistence/payments/payment.repository';
import { UserInfo } from '@lib/common/user-info';
import {
  AddPaymentDocumentCommand,
  UpdatePaymentDocumentCommand,
  RemovePaymentDocumentCommand,
} from './payment-document.command';
@Injectable()
export class PaymentCommand {
  constructor(private readonly paymentRepository: PaymentRepository) {}
  async createPayment(command: CreatePaymentCommand): Promise<PaymentResponse> {
    const paymentDomain = CreatePaymentCommand.toEntity(command);
    paymentDomain.createdBy = command?.currentUser?.id;
    paymentDomain.updatedBy = command?.currentUser?.id;
    const payment = await this.paymentRepository.insert(paymentDomain);

    return PaymentResponse.toResponse(payment);
  }
  async updatePayment(command: UpdatePaymentCommand): Promise<PaymentResponse> {
    const payment = await this.paymentRepository.getById(command.id);
    if (!payment) {
      throw new NotFoundException(`Payment not found with id ${command.id}`);
    }
    payment.vehicleId = command.vehicleId;
    payment.tenantId = command.tenantId;
    payment.contractId = command.contractId;
    payment.updatedBy = command?.currentUser?.id;
    const result = await this.paymentRepository.save(payment);
    return PaymentResponse.toResponse(result);
  }
  async archivePayment(
    command: ArchivePaymentCommand,
  ): Promise<PaymentResponse> {
    const paymentDomain = await this.paymentRepository.getById(command.id);
    if (!paymentDomain) {
      throw new NotFoundException(`Payment not found with id ${command.id}`);
    }
    paymentDomain.deletedAt = new Date();
    paymentDomain.deletedBy = command?.currentUser?.id;
    const result = await this.paymentRepository.save(paymentDomain);

    return PaymentResponse.toResponse(result);
  }
  async restorePayment(
    id: string,
    currentUser: UserInfo,
  ): Promise<PaymentResponse> {
    const paymentDomain = await this.paymentRepository.getById(id, [], true);
    if (!paymentDomain) {
      throw new NotFoundException(`Payment not found with id ${id}`);
    }
    await this.paymentRepository.restore(id);
    paymentDomain.deletedAt = null;
    return PaymentResponse.toResponse(paymentDomain);
  }
  async deletePayment(id: string, currentUser: UserInfo): Promise<boolean> {
    const paymentDomain = await this.paymentRepository.getById(id, [], true);
    if (!paymentDomain) {
      throw new NotFoundException(`Payment not found with id ${id}`);
    }
    const result = await this.paymentRepository.delete(id);
    return result;
  }
  // documents
  async addDocument(payload: AddPaymentDocumentCommand) {
    const payment = await this.paymentRepository.getById(
      payload.paymentId,
      ['documents'],
      true,
    );
    if (!payment) throw new NotFoundException('User not found');
    const documentEntity = AddPaymentDocumentCommand.toEntity(payload);
    payment.addDocument(documentEntity);
    const updatePayment = await this.paymentRepository.save(payment);
    return PaymentResponse.toResponse(updatePayment);
  }
  async updateDocument(payload: UpdatePaymentDocumentCommand) {
    const payment = await this.paymentRepository.getById(
      payload.paymentId,
      ['documents'],
      true,
    );
    if (!payment) throw new NotFoundException('User not found');
    let document = payment.documents.find(
      (paymentDocument) => paymentDocument.id === payload.id,
    );
    if (!document) throw new NotFoundException('Document not found');
    document = { ...document, ...payload };
    document.updatedBy = payload?.currentUser?.id;
    payment.updateDocument(document);
    const updatePayment = await this.paymentRepository.save(payment);
    return PaymentResponse.toResponse(updatePayment);
  }
  async removeDocument(payload: RemovePaymentDocumentCommand) {
    const payment = await this.paymentRepository.getById(
      payload.paymentId,
      ['documents'],
      true,
    );
    if (!payment) throw new NotFoundException('Vehicle not found');
    const document = payment.documents.find(
      (paymentDocument) => paymentDocument.id === payload.id,
    );
    if (!document) throw new NotFoundException('Document not found');
    payment.removeDocument(document.id);
    const result = await this.paymentRepository.save(payment);
    return PaymentResponse.toResponse(result);
  }
}
