import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductEntity} from "./entities/product.entity.js";
import {ProductController} from "./product.controller.js";
import {ProductService} from "./product.service.js";
import {RedisModule} from "../redis/redis.module.js";
import {RedisService} from "../redis/redis.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), RedisModule],
  controllers: [ProductController],
  providers: [ProductService, RedisService]
})
export class ProductModule {}
