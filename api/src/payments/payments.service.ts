import { BadRequestException, Injectable } from '@nestjs/common';
import { StripeService } from './stripe.service.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import * as process from 'node:process';
import {
  CompanyEntity,
  CompanyStatus,
} from '../companies/entities/company.entity.js';
import {Not, Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {CreateCheckoutDto} from "./dto/create-checkout.dto.js";
import {PaymentEntity} from "./entityties/payment.entity.js";
import {UserDTO} from "../auth/dto/user.dto.js";
import {UpdateSubDto} from "./dto/update_subscription.dto.js";
import {Amount_dueDto} from "./dto/amount_due.dto.js";
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
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const company_id = Number(session.metadata?.companyId);
        const employeesLimit = session.metadata?.employeesLimit;
        if(typeof session.subscription !== 'string') {
          throw new BadRequestException('Subscription ID is missing');
        }
        const subscription = await this.stripeService.retrieve(session.subscription);
        if (company_id) {
          const findCompany = await this.companyDB.findOneBy({
            id: Number(company_id),
          });
          if (findCompany?.id) {
            await this.companyDB.update({ id: Number(company_id) }, { status: CompanyStatus.ACTIVE });
            if(typeof session.customer === 'string' &&  typeof session.currency === 'string') {
              const payment = this.paymentDB.create({payment_status:{id:1}
              ,company_id, price: Number((Number(session.amount_total)/100).toFixed(2)),
               current_period_end: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString().split('T')[0]:'',
              stripe_subscription_id: session.subscription, employee_limit: Number(employeesLimit),
              stripe_customer_id: session.customer, currency: session.currency
            });
            await this.paymentDB.save(payment);
            }else {
              throw new BadRequestException('Payment not found.');
            }
          }else {
            throw new BadRequestException('Company not found.');
          }
        }
        console.log('checkout.session.completed');
        break;
      }
      case "customer.subscription.updated":{
        const session = event.data.object;
        const {paymentId, cancelAtPeriodEnd, employee_limit, price} = session.metadata;
        let obj = {cancel_at_period_end: !!Number(cancelAtPeriodEnd)};
        if(employee_limit && String(price)){
          obj['employee_limit'] = employee_limit;
          obj['price'] = price;
        }
        if(paymentId && String(cancelAtPeriodEnd)){
          await this.paymentDB.update({id: Number(paymentId)},obj);
        }else {
          throw new BadRequestException('Something went wrong');
        }
        console.log('customer.subscription.updated:');
        break;
      }
      case "customer.subscription.deleted":{
        const subscription = event.data.object;
        const sub_id = subscription?.id;
        await this.paymentDB.update({stripe_subscription_id:sub_id},{payment_status:{id:2}});
        console.log('customer.subscription.deleted');
        break;
      }
      case "invoice.payment_failed":{
        const invoice = event.data.object;
        const subscriptionId = invoice.parent?.subscription_details?.subscription;
        if (typeof subscriptionId === 'string') {
          await this.paymentDB.update({stripe_subscription_id:subscriptionId},{payment_status:{id:2}});
        }else {
          throw new BadRequestException('Something went wrong!');
        }
        console.log("invoice.payment_failed");
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    return {
      received: true,
    };
  }

  async checkPayment(data:UserDTO){
    console.log({ data });
    const resultP = await this.paymentDB.findOne({where:{company_id: data.user.company.id, payment_status:{id:Not(2)}}, relations: ['payment_status'], select:{
      id: true, cancel_at_period_end:true, stripe_subscription_id:true, current_period_end:true,
        employee_limit:true, price:true, currency:true,
        payment_status:{id:true, name:true}
      }});
    console.log({resultP});
    return resultP;
  }

  async updateSub(data: UpdateSubDto){
    return this.stripeService.updateSub(data)
  }

  async amount_due(data:Amount_dueDto){
    return await this.stripeService.amount_due(data)
  }
}
