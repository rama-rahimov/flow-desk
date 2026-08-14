import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import dotenv from 'dotenv';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity.js';
import { RoleEntity } from '../users/entities/role.entity.js';
import { AuthController } from './auth.controller.js';
import {CompanyEntity} from "../companies/entities/company.entity.js";
import {CustomerEntity} from "../customers/entities/customer.entity.js";
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, CompanyEntity, CustomerEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '7weeks'},
    }),
    PassportModule
  ],
  controllers: [AuthController],
  providers:[AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}