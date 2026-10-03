import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './users/user.module.js';
import { DealModule } from './deal/deal.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/config.js';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './companies/company.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import dotenv from 'dotenv';
import {ProductModule} from "./product/product.module.js";
import {ImageModule} from "./images/image.module.js";
import {CustomerModule} from "./customers/customer.module.js";
dotenv.config();

@Module({
  imports: [
    UserModule,
    CompanyModule,
    PaymentsModule,
    ProductModule,
    ImageModule,
    CustomerModule,
    DealModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
