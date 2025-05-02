import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Stripe } from 'stripe';
import { CreateCheckoutSessionCommand } from './stripe.command';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET);
  }

  async createCheckoutSession(
    command: CreateCheckoutSessionCommand,
  ): Promise<any> {
    try {
      const YOUR_DOMAIN = 'http://localhost:3000';
      const session = await this.stripe.checkout.sessions.create({
        // ui_mode: 'custom',
        line_items: [
          {
            price_data: {
              currency: command.currency,
              product_data: {
                name: `Test Product`, // You can customize the product name as needed
                // Additional product information can be added here
              },
              unit_amount: command.amount * 100, // Amount is in cents
            },
            quantity: command.quantity??1, // Specify the quantity of the product
          },
        ],
        // line_items: [
        //   {
        //     price: 'price_1RHUIgFSatBDijtGrpKrTdwo',
        //     quantity: command.quantity??1,
        //   },
        // ],
        mode: 'payment', // Set the mode to 'payment'
        success_url: `http://localhost:4242/success.html`, // Redirect URL on success
        cancel_url: `http://localhost:4242/cancel.html`, // Redirect URL on cancellation
        // metadata: {
        //   // Pass any additional data here, such as user ID
        //   // or product ID for handling in webhooks
        //   productId: command.productId,
        //   // userId:command.userId,
        // },
        // return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
      });
      return {
        ...session,
        clientSecret: session.client_secret,
      };
    } catch (error) {
      console.error('Error creating session:', error);
      throw new InternalServerErrorException(
        'Failed to create checkout session', // Handle errors gracefully
      );
    }
  }
  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Checkout session completed:', event.data.object);
        // Implement your business logic for successful checkout here
        // For example:
        const session = event.data.object as Stripe.Checkout.Session;
        // You can retrieve relevant information from the session object
        const { payment_status, customer, metadata } = session;

        if (payment_status === 'paid') {
          // Handle successful payment, e.g., update order status in the database
          console.log(`Payment was successful for customer: ${customer}`);
          // You might want to send an email or update your database here
        } else {
          console.warn('Payment status is not successful:', payment_status);
        }
        break;

      case 'checkout.session.expired':
        console.log('Checkout session expired:', event.data.object);
        // Handle session expiration (e.g., notify the user or update the database)
        break;

      default:
        console.warn(`Unhandled event type ${event.type}`);
        break;
    }
  }
  async getSessionStatus(session_id: string) {
    const session = await this.stripe.checkout.sessions.retrieve(session_id);
    return {
      status: session.status,
      customer_email: session.customer_details.email,
    };
  }
}
