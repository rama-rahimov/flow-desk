import {Injectable} from "@nestjs/common";
import {Stripe} from "stripe";
import dotenv from "dotenv";
import * as process from "node:process";
dotenv.config();

@Injectable()
export class StripeService {
    private stripe: Stripe;
    constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    }

    async createCheckoutSession(amount: number, companyId: string) {
        return  (await this.stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'FlowDesk subscription',
                        },
                        unit_amount: amount * 100,
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                companyId,
            },
            success_url: 'http://localhost:5173/payment/success',
            cancel_url: 'http://localhost:5173/payment/cancel',
        }))
    }
}