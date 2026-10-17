import { Module } from '@nestjs/common';
import {ImageService} from "./image.service.js";
import {ImageController} from "./image.controller.js";
import {MediaEntity} from "./entityties/image.entity.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CloudinaryService} from "./cloudinary.service.js";
import {ConfigModule} from "@nestjs/config";
import {UserEntity} from "../users/entities/user.entity.js";
import {RedisModule} from "../redis/redis.module.js";
import {RedisService} from "../redis/redis.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity, UserEntity]), ConfigModule.forRoot({isGlobal: true}),
  RedisModule],
  providers: [ImageService, CloudinaryService, RedisService],
  controllers: [ImageController],
})
export class ImageModule {}
