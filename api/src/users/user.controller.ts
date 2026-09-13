import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service.js';
import {EditProfileDto} from "./dto/edit.dto.js";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard.js";
import {AddDto} from "./dto/add.dto.js";

@Controller('api/user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}
  @Patch('profile/edit')
  @UseGuards(JwtAuthGuard)
  editProfile(@Req() req, @Body() data: EditProfileDto) {
    return this.usersService.editProfile(req.user.id, req.user.email, data)
  }

  @Get('profile/current')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  add(@Body() data: AddDto, @Req() req) {
    console.log({ data });
    return this.usersService.add(data, req.user);
  }

  @Get('employees')
  @UseGuards(JwtAuthGuard)
  getEmployees(@Req() req) {
    return this.usersService.getEmployees(req.user);
  }

  @Delete('employee/:id')
  @UseGuards(JwtAuthGuard)
  deleteEmployee(@Req() req, @Param('id') id: number) {
    return this.usersService.deleteEmployee(req.user, id);
  }
}
