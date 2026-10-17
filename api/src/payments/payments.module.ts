import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller.js';
import { StripeService } from './stripe.service.js';
import { PaymentsService } from './payments.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from '../companies/entities/company.entity.js';
import {PaymentEntity} from "./entityties/payment.entity.js";
import {RedisModule} from "../redis/redis.module.js";
import {RedisService} from "../redis/redis.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity, PaymentEntity]), RedisModule],
  controllers: [PaymentsController],
  providers: [StripeService, PaymentsService, RedisService],
})
export class PaymentsModule {}
