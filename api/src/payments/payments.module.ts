import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller.js';
import { StripeService } from './stripe.service.js';
import { PaymentsService } from './payments.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from '../companies/entities/company.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity])],
  controllers: [PaymentsController],
  providers: [StripeService, PaymentsService],
})
export class PaymentsModule {}
