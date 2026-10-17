import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity.js';
import { CompanyController } from './company.controller.js';
import { CompanyService } from './company.service.js';
import {RedisModule} from "../redis/redis.module.js";
import {RedisService} from "../redis/redis.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity]), RedisModule],
  controllers: [CompanyController],
  providers: [CompanyService, RedisService]
})
export class CompanyModule {}