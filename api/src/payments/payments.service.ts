import { BadRequestException, Injectable } from '@nestjs/common';
import { StripeService } from './stripe.service.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import * as process from 'node:process';
import {
  CompanyEntity,
  CompanyStatus,
} from '../companies/entities/company.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {CreateCheckoutDto} from "./dto/create-checkout.dto.js";
import {PaymentEntity} from "./entityties/payment.entity.js";
dotenv.config();

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  constructor(
    private readonly stripeService: StripeService,
    @InjectRepository(CompanyEntity) private readonly companyDB: Repository<CompanyEntity>,
    @InjectRepository(PaymentEntity) private readonly paymentDB: Repository<PaymentEntity>
  ) {
    console.log({STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET})
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  async createCheckout(data:CreateCheckoutDto) {
    const session = await this.stripeService.createCheckoutSession(
      data
    );
    return { success: true, url: session.url };
  }
  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      console.log('Webhook verification failed: ', error);
      throw new BadRequestException('Invalid webhook signature');
    }
    console.log('Verified Stripe event: ', event.type);
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('Event: ', event);
        const session = event.data.object;
        const company_id = Number(session.metadata?.companyId);
        const employeesCount = session.metadata?.employeesCount;
        if (company_id) {
          const findCompany = await this.companyDB.findOneBy({
            id: Number(company_id),
          });
          if (findCompany?.id) {
             await this.companyDB.update(
              { id: Number(company_id) },
              { status: CompanyStatus.ACTIVE, },
            );
            console.log({customer: session.customer_details, total_details: session.total_details, price: Number((Number(session.amount_total)/100).toFixed(2)),
              current_period_end: new Date(session.expires_at * 1000).toISOString().split('T')[0],
              stripe_subscription_id: String(session.subscription), employee_limit: Number(employeesCount),
              stripe_customer_id: String(session.customer), currency: String(session.currency)});
            if(typeof session.customer === 'string' && typeof employeesCount === 'number' && typeof session.currency === 'string'
                && typeof session.subscription === 'string') {
              const payment =  await this.paymentDB.create({payment_status:{id:1}
                ,company_id, price: Number((Number(session.amount_total)/100).toFixed(2)),
                current_period_end: new Date(session.expires_at * 1000).toISOString().split('T')[0],
                stripe_subscription_id: session.subscription, employee_limit: employeesCount,
                stripe_customer_id: session.customer, currency: session.currency
              });
              return this.paymentDB.save(payment);
            }else {
              return {success: false, error: 'Payment not found'};
            }
          }else {
            throw new BadRequestException('Company not found.');
          }
        }
        console.log('Checkout completed:', session.id);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    return {
      received: true,
    };
  }
}
