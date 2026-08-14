import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { LoginDto } from './dto/login.dto.js';

@Controller()
export class UserController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/api/findOneBy')
  findOneBy() {
    return this.usersService.findOneBy();
  }

  @Get('/api/findBy')
  findBy() {
    return this.usersService.findBy();
  }

  @Delete('/api/deleteUser')
  deleteUser() {
    return this.usersService.deleteUser();
  }

  @Post('/api/addUser')
  addUser(){
    return this.usersService.addUser();
  }

  @Post('/api/updateProfile')
  updateProfile() {
    return this.usersService.updateProfile();
  }
}