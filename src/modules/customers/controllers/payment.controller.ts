import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  IncludeQuery,
  CollectionQuery,
} from '@lib/collection-query/collection-query';
import { ApiPaginatedResponse } from '@lib/response-format/api-paginated-response';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { UserInfo } from '@lib/common/user-info';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import {
  ArchivePaymentCommand,
  CreatePaymentCommand,
  UpdatePaymentCommand,
} from '@customer/usecases/payments/payment.commands';
import { PaymentCommand } from '@customer/usecases/payments/payment.usecase.command';
import { PaymentQuery } from '@customer/usecases/payments/payment.usecase.query';
import {
  AddPaymentDocumentCommand,
  UpdatePaymentDocumentCommand,
  RemovePaymentDocumentCommand,
} from '@customer/usecases/payments/payment-document.command';
import { PaymentResponse } from '@customer/usecases/payments/payment.response';

@Controller('payments')
@ApiTags('payments')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class PaymentController {
  constructor(
    private command: PaymentCommand,
    private paymentQuery: PaymentQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: PaymentResponse })
  async getPayment(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.paymentQuery.getPayment(id, includeQuery.includes, true);
  }
  @Get()
  @ApiPaginatedResponse(PaymentResponse)
  async getPayments(@Query() query: CollectionQuery) {
    return this.paymentQuery.getPayments(query);
  }
  @Post()
  @ApiOkResponse({ type: PaymentResponse })
  async createPayment(
    @CurrentUser() currentUser: UserInfo,
    @Body() createPaymentCommand: CreatePaymentCommand,
  ) {
    createPaymentCommand.currentUser = currentUser;
    return this.command.createPayment(createPaymentCommand);
  }
  @Put(':id')
  @ApiOkResponse({ type: PaymentResponse })
  async updatePayment(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @Body() updatePaymentCommand: UpdatePaymentCommand,
  ) {
    updatePaymentCommand.currentUser = currentUser;
    updatePaymentCommand.id = id;
    return this.command.updatePayment(updatePaymentCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: PaymentResponse })
  async archivePayment(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchivePaymentCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archivePayment(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deletePayment(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deletePayment(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: PaymentResponse })
  async restorePayment(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restorePayment(id, currentUser);
  }
  // documents
  @Post('add-document')
  @ApiOkResponse({ type: PaymentResponse })
  async addDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: AddPaymentDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.addDocument(command);
  }
  @Put('update-document')
  @ApiOkResponse({ type: PaymentResponse })
  async updateDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: UpdatePaymentDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.updateDocument(command);
  }
  @Post('remove-document')
  @ApiOkResponse({ type: PaymentResponse })
  async archiveDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: RemovePaymentDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.removeDocument(command);
  }
}
