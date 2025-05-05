import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET);
  }

  // Create Stripe Product
  async createProduct(name: string, description: string = '', metadata = {}) {
    return this.stripe.products.create({ name, description, metadata });
  }
  async getProductByName(name: string): Promise<Stripe.Product | null> {
    const products = await this.stripe.products.list({ limit: 100 });
    return products.data.find((p) => p.name === name) || null;
  }
  async updateProduct(
    productId: string,
    updates: Partial<Stripe.ProductUpdateParams>,
  ): Promise<Stripe.Product> {
    return this.stripe.products.update(productId, updates);
  }
  // Create Price for a Product
  async createPrice(
    productId: string,
    amount: number,
    nickname = '',
    metadata={},
    currency = 'pln',
  ) {
    return this.stripe.prices.create({
      product: productId,
      currency,
      unit_amount: amount * 100,
      nickname,
      metadata
    });
  }
  async getPricesByProduct(productId: string): Promise<Stripe.Price[]> {
    const prices = await this.stripe.prices.list({
      product: productId,
      limit: 100,
    });

    return prices.data;
  }
  /**
   * ⚠️ Stripe does not support updating price amounts once created — you must archive and create a new one.
   * However, you can update nickname and metadata
   */

  async updatePrice(
    priceId: string,
    updates: Partial<Pick<Stripe.PriceUpdateParams, 'metadata' | 'nickname' | 'active'>>,
  ): Promise<Stripe.Price> {
    return this.stripe.prices.update(priceId, updates);
  }
  // Create Checkout Session
  async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
  ) {
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session.url;
  }
  async createCustomer(
    email: string,
    name?: string,
    metadata: Record<string, string> = {},
  ) {
    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata, // Optional: attach your internal user ID or tenant ID
    });
    return customer;
  }
  async getCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
    const customers = await this.stripe.customers.list({ email, limit: 1 });

    if (customers.data.length > 0) {
      return customers.data[0];
    }

    return null;
  }
  async updateCustomer(
    customerId: string,
    updates: Partial<Stripe.CustomerUpdateParams>,
  ): Promise<Stripe.Customer> {
    return this.stripe.customers.update(customerId, updates);
  }

  // Retrieve Webhook Event
  verifyWebhook(signature: string, payload: Buffer) {
    const secret = this.configService.get<string>('stripe.webhookSecret');
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
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
