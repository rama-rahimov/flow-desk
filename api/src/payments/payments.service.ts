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
dotenv.config();

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  constructor(
    private readonly stripeService: StripeService,
    @InjectRepository(CompanyEntity)
    private readonly companyDB: Repository<CompanyEntity>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  async createCheckout(companyId: string, employeesCount: number) {
    const price = this.calculatePrice(employeesCount);
    const session = await this.stripeService.createCheckoutSession(
      price,
      companyId,
    );
    return { success: true, url: session.url };
  }
  private calculatePrice(employeesCount: number): number {
    return employeesCount * 10;
  }
  async handleWebhook(rawBody: Buffer, signature: string) {
    console.log('Taaaakkk');
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
        const session = event.data.object;
        const companyId = session.metadata?.companyId;
        console.log({ companyId });
        if (companyId) {
          const findCompany = await this.companyDB.findOneBy({
            id: Number(companyId),
          });
          console.log({ findCompany });
          if (findCompany?.id) {
            const update = await this.companyDB.update(
              { id: Number(companyId) },
              { status: CompanyStatus.ACTIVE },
            );
            console.log({ update });
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
