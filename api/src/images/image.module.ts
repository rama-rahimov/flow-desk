import { Module } from '@nestjs/common';
import {ImageService} from "./image.service.js";
import {ImageController} from "./image.controller.js";
import {MediaEntity} from "./entityties/image.entity.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CloudinaryService} from "./cloudinary.service.js";
import {ConfigModule} from "@nestjs/config";
import {UserEntity} from "../users/entities/user.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity, UserEntity]), ConfigModule.forRoot({isGlobal: true})],
  providers: [ImageService, CloudinaryService],
  controllers: [ImageController],
})
export class ImageModule {}
