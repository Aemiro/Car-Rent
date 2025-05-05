import {
  Controller,
  Post,
  Headers,
  RawBody,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { Request } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('webhook')
  async handleWebhook(
    @RawBody() req: Request,
    @Headers('stripe-signature') signature: string,
    @Res() res,
  ) {
    try {
      const event = this.stripeService.verifyWebhook(signature, req.body);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Payment received:', session);
        // Update your DB (e.g., invoice status)
      }

      res.status(HttpStatus.OK).send({ received: true });
    } catch (err) {
      console.error('Webhook Error:', err.message);
      res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }
  }
}
