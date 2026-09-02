// import { UserEntity } from './entities/user.entity.js';
import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { RoleEntity } from './entities/role.entity.js';

@Injectable()
export class UsersService {
  constructor(
    // @InjectRepository(UserEntity)
    // private readonly userBD: Repository<UserEntity>,
    // @InjectRepository(RoleEntity)
    // private readonly roleBD: Repository<RoleEntity>,
  ) {}
  //  findOneBy() {
  //   try {
  //   } catch (error) {
  //     console.log({ error });
  //     return { success: false, message: (error as Error).message };
  //   }
  // }
  //  findBy() {
  //   try {
  //   } catch (error) {
  //     console.log({ error });
  //     return { success: false, message: (error as Error).message };
  //   }
  // }
  //
  //  deleteUser() {
  //   try {
  //   } catch (error) {
  //     console.log({ error });
  //     return { success: false, message: (error as Error).message };
  //   }
  // }
  //
  //  addUser() {
  //   try {
  //   } catch (error) {
  //     console.log({ error });
  //     return { success: false, message: (error as Error).message };
  //   }
  // }
  //
  //  updateProfile() {
  //   try {
  //   } catch (error) {
  //     console.log(error);
  //     return { success: false, message: (error as Error).message };
  //   }
  // }
}
