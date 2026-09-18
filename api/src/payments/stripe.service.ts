import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import dotenv from 'dotenv';
import * as process from 'node:process';
import {CreateCheckoutDto} from "./dto/create-checkout.dto.js";
import {UpdateSubDto} from "./dto/update_subscription.dto.js";
import {Amount_dueDto} from "./dto/amount_due.dto.js";
dotenv.config();

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  async createCheckoutSession(data:CreateCheckoutDto) {
    return await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'FlowDesk subscription',
            },
            unit_amount: data.price*100,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        companyId:data.companyId,
        employeesLimit: data.employeesLimit
      },
      success_url: 'http://localhost:5173/payment/success',
      cancel_url: 'http://localhost:5173/payment/cancel',
    });
  }

  async updateSub(data: UpdateSubDto) {
    console.log({data});
    return await this.stripe.subscriptions.update(data.sub_id, {cancel_at_period_end: data.cancel_at_period_end,
      metadata:{paymentId: data.paymentId, cancelAtPeriodEnd: data.cancel_at_period_end?1:0,
        employee_limit:data.employee_limit, price:data.price}});
  }

  async retrieve(sessionId:string) {
    return await this.stripe.subscriptions.retrieve(sessionId);
  }

  async amount_due(data:Amount_dueDto){
    const subscription = await this.retrieve(data.subscription_id);
    const price = await this.stripe.prices.create({
      currency: 'usd',
      unit_amount: Number(data.price)*100,
      recurring:{
        interval: 'month',
      },
      product_data:{
        name: 'FlowDesk subscription',
      }
    });
    console.log({price, subscription});
    return await this.stripe.invoices.createPreview({
      subscription:data.subscription_id,
      subscription_details:{
        items:[{
          id: subscription.items.data[0].id, price: price.id
        }]
      }
    })
  }
}
