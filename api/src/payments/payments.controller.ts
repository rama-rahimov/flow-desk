import {Body, Controller, HttpCode, Post, RawBodyRequest, Req, Headers, BadRequestException} from "@nestjs/common";
import {PaymentsService} from "./payments.service.js";
import {CreateCheckoutDto} from "./dto/create-checkout.dto.js";
import dotenv from 'dotenv';
import Stripe from "stripe";
dotenv.config();

@Controller('api/payments')
export class PaymentsController {
    private stripe: Stripe;
    constructor(private readonly paymentService: PaymentsService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    }
    @Post('create-checkout')
    createCheckout(@Body() dto: CreateCheckoutDto){
        return this.paymentService.createCheckout(dto.companyId, dto.employeesCount);
    }

    @Post('webhook')
    @HttpCode(200)
    webhook(@Req() req: RawBodyRequest<Request>,
            @Headers('stripe-signature') signature: string){
        console.log("Offffff Daavvaaaayyy )))");
        return this.paymentService.handleWebhook(req.rawBody!, signature);
    }
}