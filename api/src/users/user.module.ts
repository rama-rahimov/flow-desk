import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity.js';
import { RoleEntity } from './entities/role.entity.js';
import { UserController } from './user.controller.js';
import { AuthModule } from '../auth/auth.module.js';


@Module({
imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity]), AuthModule],
controllers: [UserController],
providers: [UsersService],
})
export class UserModule {}