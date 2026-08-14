import { UserEntity } from './entities/user.entity.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity)
  private readonly userBD: Repository<UserEntity>,
  @InjectRepository(RoleEntity)
  private readonly roleBD: Repository<RoleEntity>) {}
  async findOneBy() {
    try {

    }catch (error) {
      console.log({ error });
      return {success: false, message: error.message };
    }
  }
  async findBy() {
    try {

    }catch (error) {
      console.log({ error });
      return {success: false, message: error.message };
    }
  }

  async deleteUser() {
    try {

    }catch (error) {
      console.log({ error });
      return {success: false, message: error.message };
    }
  }

  async addUser() {
    try {

    }catch (error) {
      console.log({ error });
      return {success: false, message: error.message };
    }
  }

  async updateProfile() {
    try {

    }catch (error) {
      console.log(error);
      return {success: false, message: error.message };
    }
  }
}