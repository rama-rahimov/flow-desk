import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import dotenv from 'dotenv';
import * as process from 'node:process';
import {CreateCheckoutDto} from "./dto/create-checkout.dto.js";
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
        employeesCount: data.employeesCount
      },
      success_url: 'http://localhost:5173/payment/success',
      cancel_url: 'http://localhost:5173/payment/cancel',
    });
  }
}
