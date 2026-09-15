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
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    this.stripe.accounts.retrieve('').then(account => {
      console.log('STRIPE ACCOUNT:', account.id);
    });
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
        const companyId = Number(session.metadata?.companyId);
        // const employeesCount = session.metadata?.employeesCount;
        // const payment = await this.paymentDB.findOneBy({company_id:companyId});
        if (companyId) {
          const findCompany = await this.companyDB.findOneBy({
            id: Number(companyId),
          });
          if (findCompany?.id) {
             await this.companyDB.update(
              { id: Number(companyId) },
              { status: CompanyStatus.ACTIVE, },
            );
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
