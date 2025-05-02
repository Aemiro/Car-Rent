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
} from '@finance/usecases/payments/payment.commands';
import { PaymentCommand } from '@finance/usecases/payments/payment.usecase.command';
import { PaymentQuery } from '@finance/usecases/payments/payment.usecase.query';
import {
  AddPaymentDocumentCommand,
  UpdatePaymentDocumentCommand,
  RemovePaymentDocumentCommand,
} from '@finance/usecases/payments/payment-document.command';
import { PaymentResponse } from '@finance/usecases/payments/payment.response';
import { StripeService } from '@finance/usecases/stripes/stripe.service';
import { CreateCheckoutSessionCommand } from '@finance/usecases/stripes/stripe.command';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Stripe } from 'stripe';
import { Request } from 'express';
import { AllowAnonymous } from '@auth/decorators/allow-anonymous.decorator';
@Controller('payments')
@ApiTags('payments')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
@AllowAnonymous()
export class PaymentController {
  constructor(
    private command: PaymentCommand,
    private paymentQuery: PaymentQuery,
    private stripeService: StripeService,
  ) {}
  @Get('session-status')
  @AllowAnonymous()
  async getSessionStatus(@Query('session_id') session_id: string) {
    return this.stripeService.getSessionStatus(session_id);
  }
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
  @Post('create-checkout-session') // Define the route for creating a checkout session
  @AllowAnonymous()
  async createCheckoutSession(
    @Body()
    command: CreateCheckoutSessionCommand,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripeService.createCheckoutSession(command); // Call the service method to create the session
  }
  @Post('webhook')
  @AllowAnonymous()
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret = process.env.WEB_HOOK_SECRET;
    let event: Stripe.Event;

    try {
      event = this.stripeService['stripe'].webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret,
      );
    } catch (err) {
      return { error: `Webhook Error: ${err.message}` };
    }

    await this.stripeService.handleWebhook(event);
  }
}
