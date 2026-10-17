import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity.js';
import { RoleEntity } from './entities/role.entity.js';
import { UserController } from './user.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard.js";
import {JwtModule} from "@nestjs/jwt";
import * as process from "node:process";
import {RedisModule} from "../redis/redis.module.js";
import {RedisService} from "../redis/redis.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity]), AuthModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: {expiresIn: '7weeks'},
  }), RedisModule],
  controllers: [UserController],
  providers: [UsersService, JwtAuthGuard, RedisService]
})
export class UserModule {}
